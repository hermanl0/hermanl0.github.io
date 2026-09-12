---
layout: post
title: "How my AI chat bot ran in production"
date: 2026-09-10
author: hermanl0
categories: blog
---

<img src="/img/sharkbot-harmony.svg" alt="chat talks to a sandboxed bot with an on-prem LLM, which reaches read-only APIs" width="820">

Sharkbot is a Mattermost chat bot used by a network operations team. It answers questions in a channel by looking things up in read-only systems: a ticketing system, an SNMP monitoring platform, and a documentation knowledge base. This post covers the production setup: an LLM agent connected to live systems, with no stored credentials and no network access.

The name comes from an earlier hackathon build whose only job was running `tshark` (the command-line side of Wireshark) over packet captures. It is unrelated to the Android malware of the same name.

---

## Architecture

The agent runs on [OpenClaw](https://github.com/openclaw/openclaw), which provides the agent loop, tool-calling, and the Mattermost integration. The remaining components isolate it.

| Component | What it does |
|-----------|--------------|
| **OpenClaw agent** | The bot: reasoning loop, tool-calling, Mattermost |
| **nono sandbox (Landlock)** | Runs the agent with no network access |
| **Secrets gateway** | Local proxy that holds every real credential |
| **On-prem LLM** | Inference on `gpt.uio.no` |
| **Read-only tools** | Tickets, monitoring, docs knowledge base, all GET-only |

---

## Data Flow

Users interact with the bot in Mattermost. The agent has no direct network access; it connects only to the secrets gateway on loopback. The gateway makes the outbound calls on its behalf: to Mattermost, the LLM, and the read-only lookups.

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

From the agent's side, every endpoint is `127.0.0.1`.

---

## Sandboxing and Credentials

The agent runs in a Landlock sandbox with networking blocked. An `nftables` rule restricts its user to loopback only, so any other outbound traffic is dropped at the host.

The agent holds no real credentials. Its configuration points only at the gateway:

```
baseURL: http://127.0.0.1:8090/v1
apiKey:  sk-dummy
```

The real credentials — the LLM key, the Mattermost bot token, and the lookup API keys — are held only by the gateway. On each request, the gateway matches the route, injects the correct credential, and forwards it. This also covers the Mattermost connection: the bot posts as itself without the token being present in the sandbox.

The lookup routes are GET-only, so a compromised agent can read from those systems but not modify them.

---

## Threat Model

There is no credential in the agent to steal, and no route to exfiltrate over. The remaining case is a confused deputy: the bot being prompted to read data it already has access to. That is limited by scoping each key as narrowly as possible.

---

## Deployment

The gateway runs as a Docker container; the sandboxed agent runs as a service alongside it. Updates use a pinned version installed to a staging copy, smoke-tested in the sandbox (confirming it connects and answers a query), and promoted only if the test passes. There is no automatic pull of `latest`.

A set of host timers post a daily network-health summary to a status channel.

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'dark' });
</script>
