---
layout: post
title: "Simple Packet Inspection with AI/LLM"
date: 2025-08-28
author: hermanl0
categories: blog
---

### Why I Started

I wanted to see how far a large-language model (LLM) could take me when I’m trying to understand raw network traffic.  
Two ideas popped up in my mind:

1. **Export a tiny hex-dump from Wireshark and let the model classify it.**  
2. **Use the OpenCode TUI to capture a few thousand packets, run a handful of shell commands, and have the model stitch the results together.**

Both approaches promise the same thing: the AI does the heavy pattern-recognition while I stay in control of the data. 
This was performed on an on-premise (local) LLM .

---

## 1. What I Needed

| Tool | Reason I chose it | How I installed it |
|------|-------------------|--------------------|
| **Wireshark** | Quick visual capture; easy hex-dump export. | `apt-get install wireshark` |
| **tcpdump** | Script-friendly, works without a GUI. | `apt-get install tcpdump` |
| **OpenCode** | Provides a terminal UI that can call LLMs and run shell commands in one place. | See the “Installing OpenCode” section below. |
| **API key** | Required to talk to the local models. | Grab one from your provider and replace the placeholder `<your-api-key>` in the config file. |

---

## 2. Installing OpenCode (the TUI I used)

```bash
# 1️⃣  Create a local bin directory
mkdir -p ~/.opencode/bin

# 2️⃣  Pull the installer and run it
curl -L https://opencode.ai/install.sh | sh

# 3️⃣  Put OpenCode on my PATH
echo 'export PATH="$HOME/.opencode/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
````

### 2.1 My Provider Configuration

I created `~/.opencode/config.json` and pasted the following (only the API key needed editing):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "educloud": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Educloud Provider",
      "options": {
        "baseURL": "<your-local-api-endpoint>",
        "apiKey": "<your-api-key>"
      },
      "models": {
        "Qwen3-Coder-480B-A35B-Instruct": {
          "name": "Qwen3-Coder-480B-A35B-Instruct",
          "options": {
            "contextSize": 128000
          }
        }
      }
    }
  },
  "permission": {
    "edit": "allow",
    "bash": "ask",
    "webfetch": "deny"
  }
}
```

I kept the permission block simple:
I’m fine with the model editing the session, I want it to ask before running any Bash command, and I definitely don’t want it fetching the web.

---

## 3. Capturing Packets

### 3.1 Tiny Demo – Wireshark → Hex Dump

1. I opened Wireshark, started a capture on my primary NIC, and stopped after a few seconds.
2. I exported the capture as **“Plain Text (Hex Dump)”**, deliberately stripping timestamps and column headers.
3. I saved the file as `sample.hex`.

A few lines of the file (with made-up values) look like this:

```
0000  01 00 5e 00 00 fb 00:11:22:33:44:55 5e 00:11:22:33:44:55 0f d5 08 00 45 00
0010  01 0d 22 7c c0 00 00 01 11 f4 9c 192.0.2.10 00 24 198.51.100.20 00
...
```

*I replaced the real MAC and IP addresses with logically-consistent placeholders.*

### 3.2 Larger Capture – OpenCode + tcpdump

Inside the OpenCode TUI I asked it to list interfaces and capture 2000 packets.

```
> ip link show
> sudo tcpdump -i enp3s0 -c 2000 -w network_capture.pcap
```

OpenCode printed the interface list, then captured exactly **2000** packets on `enp3s0`.
The capture lasted about 24 seconds, and the tool confirmed that no packets were dropped.

---

## 4. Getting the Data Ready for the LLM

### 4.1 Turning the hex dump into a single string

```bash
cat sample.hex | awk '{for(i=2;i<=NF-1;i++) printf $i " "; print ""}' > raw.hex
```

`raw.hex` now contains only the hexadecimal byte stream, one line per packet.

### 4.2 Summarising the pcap file

I let OpenCode run a couple of quick `tcpdump` pipelines and saved the results:

`first20.txt` gives me a glimpse of the first 20 packets, while `top-talkers.txt` lists the most frequent source addresses.

---

## 5. Asking the AI to Analyse

### 5.1 The Prompt I Fed the Model

```
You are a network-analysis assistant.
Given the following packet data (hex bytes or textual tcpdump output), perform:

1. Protocol detection – list every protocol you see and the percentage of packets belonging to each.
2. Host discovery – extract MAC addresses, IP addresses, hostnames (if any).
3. Top talkers – rank source→destination pairs by packet count.
4. Interesting events – flag anything unusual (clear-text HTTP, unexpected ports, possible scans).

Return the answer as markdown with tables and a short natural-language summary.
```

### 5.2 Running the Model

```bash
opencode run \
  --model educloud.Qwen3-Coder-480B-A35B-Instruct \
  --prompt-file prompt.txt \
  --data-files raw.hex first20.txt top-talkers.txt
```

OpenCode streamed the model’s response back to me in the same terminal window.
I copied the markdown output and used it as the basis for the next section of this post.

---

## 6. What the Model Told Me (My Merged Results)

### 6.1 Protocol Breakdown

| Protocol                        | Packets | % of total |
| ------------------------------- | ------: | ---------: |
| **TCP (SSH, port 22)**          |   1 914 |     95.7 % |
| **ICMPv6 (Neighbor Discovery)** |      42 |      2.1 % |
| **TLS/HTTPS (port 443)**        |      18 |      0.9 % |
| **Other / Unidentified**        |      26 |      1.3 % |

### 6.2 Top Talkers

| Rank | Source → Destination                                | Packets |
| ---- | --------------------------------------------------- | ------: |
| 1    | **192.0.2.10:22** → **198.51.100.20:60530**         |   1 027 |
| 2    | **198.51.100.20:60530** → **192.0.2.10:22**         |     887 |
| 3    | **fe80::aabb:ccdd:eeff** → **2001:db8::1** (ICMPv6) |      31 |
| 4    | **203.0.113.5:443** → **192.0.2.10:46158** (TLS)    |       4 |
| 5    | **2001:db8::2:443** → **2001:db8::3:35712** (TLS)   |       4 |

### 6.3 Host & Service Summary

| Host                    | MAC / IP                                                                  | Observed Services               |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| **My laptop**           | `00:11:22:33:44:55` / `192.0.2.10` (IPv4) / `fe80::aabb:ccdd:eeff` (IPv6) | SSH (port 22), occasional HTTPS |
| **Remote admin server** | `198.51.100.20`                                                           | SSH counterpart                 |
| **IPv6 neighbor**       | `2001:db8::1`                                                             | ICMPv6 neighbor solicitation    |
| **HTTPS endpoint**      | `203.0.113.5`                                                             | TLS/SSL (port 443)              |

---

## 7. Final Thoughts

* The **hex-dump-only route** is perfect for teaching, quick demos, or when I only need a handful of packets.
* The **OpenCode TUI** lets me capture a realistic amount of traffic, run shell commands, and keep everything inside a single terminal session—great for automation or when I’m working on a headless server.
* By **combining both methods** I now have a flexible toolbox that scales from a few lines of Wireshark output to multi-megabyte pcap files, all while staying in full control of the data and the AI’s reasoning.
