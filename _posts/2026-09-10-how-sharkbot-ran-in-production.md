---
layout: post
title: "How sharkbot ran in production"
date: 2026-09-10
author: hermanl0
categories: blog
---

Sharkbot was a Mattermost chat bot I ran for a network operations team. You ask it a question in the channel — "any tickets waiting on me?", "what model is that switch?", "what did the logs say during yesterday's outage?" — and it looks things up and answers in the thread. This is a write-up of how it actually ran in production: an LLM agent wired into live operational systems that never held a credential and never touched the internet.

<img src="/img/sharkbot-harmony.svg" alt="chat talks to a sandboxed bot with an on-prem LLM, which reaches read-only APIs" width="820">

A note on the name first, since it is also a well-known piece of Android malware: this sharkbot is unrelated. It got its name at the hackathon where I first built it, where its one job was to run `tshark` — the command-line side of Wireshark — over packet captures on request. The packet-analysis role faded, but the name stuck.

### The shape of it

Sharkbot was built on [OpenClaw](https://github.com/openclaw/openclaw), an agent framework that gave me the agent loop, tool-calling, and a Mattermost integration out of the box. The model itself ran against an on-prem LLM, so the questions and the operational data behind them never left the organisation. Its tools were a handful of read-only lookups: a ticketing system, an SNMP monitoring platform, and a knowledge base built from internal docs and past cases.

The interesting part was never the model. It was making it safe to point an autonomous agent at live production systems — because the moment an LLM can read real data and call real APIs, two questions matter more than anything it says: can it leak a credential, and can it reach somewhere it shouldn't?

### How the pieces fit together

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

You talk to Mattermost, where the bot is a normal member of the channel. The bot itself talks only to the gateway — including to reach Mattermost, since it has no network of its own. Everything dangerous lives outside the sandbox.

### Sandboxed, with no way out

The agent ran inside a [Landlock](https://landlock.io/) sandbox with its network access blocked outright. On top of that, an nftables rule pinned the agent's own user to loopback only — not the internet, not the internal network, nothing but `127.0.0.1`. If a prompt-injected model ever decided to phone home or scan the network, the packets simply had nowhere to go.

### The secrets gateway

The agent never held a single real API key. Every credential — the LLM key, the Mattermost bot token, the read-only API keys — lived in a small sidecar proxy, the "secrets gateway", bound to loopback. The agent's own config held nothing but a dummy placeholder. Every outbound call went to the gateway, which matched the route, injected the correct credential, and forwarded the request. That included the bot's own connection to Mattermost — which is why the agent could chat with you while never touching the token that let it. The lookup routes were GET-only, so even a completely compromised agent could read from those systems but never change anything in them.

That collapses the two worries into non-problems. Stolen keys: there is no key in the agent to steal. Unbounded egress: there is no route out to steal it over. What's left is the classic "confused deputy" — coaxing the bot into reading something it is already allowed to read — and I kept that bounded by giving each key the narrowest scope it could possibly need.

### Running it

The gateway ran as a Docker container and the sandboxed agent ran as a service beside it. Updates were deliberate rather than automatic: a pinned version, installed to a staging copy, smoke-tested by booting it in the sandbox and checking it still connected and answered a real query, and promoted only if it passed — never a blind pull of `latest`. Alongside the chat path, a couple of host timers posted a daily network-health digest into a status channel, so the bot was useful even when nobody was asking it anything.

### What made it work

The model does the reasoning; everything around it makes sure that is *all* it can do. Sandbox the agent, cut its network, and put every credential behind a loopback proxy, and you can hand an LLM real access to production data without handing it anything dangerous to hold. That plumbing — not the prompt — is what made sharkbot something I was actually comfortable leaving running.

<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'dark' });
</script>
