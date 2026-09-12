---
layout: post
title: "How my AI chat bot ran in production"
date: 2026-09-10
author: hermanl0
categories: blog
---

<img src="/img/sharkbot-harmony.svg" alt="chat talks to a sandboxed bot with an on-prem LLM, which reaches read-only APIs" width="820">

For a while I ran a Mattermost chat bot for our network operations team. You could @-mention it in a channel — "any tickets waiting on me?", "what model is that switch?", "what did the logs say during yesterday's outage?" — and it would go look things up and answer in the thread.

This post is about how it actually ran in production. The chat part is the easy bit. The interesting part was letting an LLM read from live operational systems without ever giving it a credential to hold or a network to escape onto.

A quick note on the name, since it's also a well-known piece of Android malware: this one is unrelated. It got its name at the hackathon where I first built it, where its only job was to run `tshark` (the command-line side of Wireshark) over packet captures. The packet-analysis part didn't last, but the name did.

---

## The Setup

I didn't write the agent from scratch. It runs on [OpenClaw](https://github.com/openclaw/openclaw), which gives you the agent loop, tool-calling, and a Mattermost integration out of the box. Everything else is plumbing I added around it to make it safe to run.

| Component | What it does |
|-----------|--------------|
| **OpenClaw agent** | The bot itself — reasoning loop, tool-calling, Mattermost |
| **nono sandbox (Landlock)** | Runs the agent with no network access |
| **Secrets gateway** | A small local proxy that holds every real credential |
| **On-prem LLM** | Inference on `gpt.uio.no`, so nothing leaves the org |
| **Read-only tools** | Tickets, monitoring, and a docs knowledge base, all GET-only |

---

## The Flow

You talk to Mattermost, where the bot sits as a normal channel member. The bot itself talks to nothing except the gateway on loopback, and the gateway is what actually reaches Mattermost, the LLM, and the lookups on its behalf.

<div class="mermaid">
flowchart LR
  user["user in Mattermost"]
  mm["Mattermost server"]
  subgraph sandbox["sandbox — Landlock, no network"]
    bot["sharkbot agent (dummy key only)"]
  end
  gw["secrets gateway (holds keys)"]
  llm["on-prem LLM (gpt.uio.no)"]
  apis["read-only lookups (tickets, monitoring, docs)"]
  user <-->|chat| mm
  bot <-->|loopback only| gw
  gw <-->|bot token| mm
  gw -->|inference| llm
  gw -->|GET only| apis
</div>

The agent has no idea what any of the real endpoints are. As far as it's concerned, everything lives at `127.0.0.1`.

---

## No Network, No Keys

Two rules do most of the work here.

First, the agent runs inside a Landlock sandbox with its network blocked, and an `nftables` rule pins its user to loopback only. If a prompt-injected model ever tries to phone home or scan the network, the packets have nowhere to go.

Second, the agent never holds a real key. Its entire view of its own credentials is this:

```
baseURL: http://127.0.0.1:8090/v1
apiKey:  sk-dummy
```

Every real credential — the LLM key, the Mattermost bot token, the API keys for the lookups — lives only in the gateway. When the agent makes a call, the gateway matches the route, swaps in the correct credential, and forwards it on. That's also how the bot talks in Mattermost at all: it chats as itself without the token that lets it ever being inside the sandbox.

The lookup routes are GET-only, so even a fully compromised agent can read from those systems but not change anything in them.

---

## What's Left to Worry About

This removes the two things I actually cared about. There's no key in the agent to steal, and no route out to steal it over. What remains is the classic confused-deputy problem — talking the bot into reading something it's already allowed to read — and I kept that small by giving every key the narrowest scope it could get away with.

---

## Running It

The gateway runs as a Docker container, and the sandboxed agent runs as a service next to it. Updates are deliberate: a pinned version, installed to a staging copy, smoke-tested by booting it in the sandbox and checking it still connects and answers a real query, and promoted only if it passes. No blind `latest`.

On top of the chat, a couple of host timers post a daily network-health summary to a status channel, so it's useful even when nobody is asking it anything.

---

## Final Thoughts

The model does the reasoning; everything around it just makes sure that's all it can do. Sandbox the agent, cut its network, and hide every credential behind a loopback proxy, and you can point an LLM at real production data without handing it anything dangerous to keep. That was the whole point, and it's the part I'd build the same way again.

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'dark' });
</script>
