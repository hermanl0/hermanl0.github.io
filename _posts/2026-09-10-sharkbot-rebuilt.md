---
layout: post
title: "Sharkbot, rebuilt: from an agent framework to a single file"
date: 2026-09-10
author: hermanl0
categories: blog
---

Sharkbot is a chat bot I built for a network operations team. The idea is simple: ask it a question in chat and it looks up live data — a ticket here, a device there — and answers in the thread, so nobody has to leave the chat window to check a status. What is interesting is not the idea but how much the implementation shrank between the first version and the one I actually kept.

A note on the name, since it is also a well-known piece of Android malware: this sharkbot is unrelated. It got its name at the hackathon where I first built it, where its job was to run `tshark` — the command-line side of Wireshark — against packet captures on request. The packet-analysis role faded, but the name stuck.

<img src="/img/sharkbot.svg" alt="A friendly cartoon sharkbot mascot" width="300">

---

### The first version: a full agent framework

I started the way you are "supposed" to and reached for a full agent framework. It ran an agent loop, exposed a shell to the model, and loaded tool plugins. Because it could run shell commands, I wrapped it in a sandbox and put a small "secrets gateway" sidecar next to it — a tiny proxy that held the API keys and made all outbound calls, so the agent itself never saw a credential. Add a build step for the runtime, a mesh VPN to reach it, and an egress proxy, and it worked.

It also had a lot of moving parts for what the bot actually did: call an LLM, let it run one or two read-only lookups, and post the result. Most of the complexity — the sandbox, the secrets gateway, the proxy — existed for a single reason: the agent had a shell, and a shell is dangerous.

---

### The rethink

Two observations changed my mind.

First, for a bounded question-and-answer bot the reasoning is the LLM's, not the framework's. The framework was really just an agent loop: send the model some messages and tool definitions, run whatever tool it asks for, feed the result back, and repeat until it answers. That is maybe thirty lines of code.

Second, all the security machinery existed because the agent could execute arbitrary commands. Remove the shell and you remove the thing that makes prompt injection scary — and with it, the reason for the sandbox and the gateway.

So I deleted the framework and wrote the loop myself.

---

### The version I kept

<img src="/img/sharkbot-flow.svg" alt="Flowchart: a question flows from the chat to sharkbot to the LLM; the LLM calls read-only APIs in a loop, then the final answer is posted back to the chat thread" width="820">

The bot is now a single file with zero dependencies — Python standard library only. On a mention or trigger word it calls an OpenAI-compatible model with a small set of read-only tool schemas, runs whichever tool the model picks, and posts the answer. The whole agent is this:

```python
messages = [{"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question}]

for _ in range(MAX_TOOL_ROUNDS):
    message = llm(messages, tools)
    messages.append(message)
    calls = message.get("tool_calls")
    if not calls:
        return message["content"]              # final answer
    for call in calls:
        result = run_tool(call["function"]["name"], parse_args(call))
        messages.append({"role": "tool",
                         "tool_call_id": call["id"],
                         "content": json.dumps(result)})
```

Every tool is a narrow, read-only lookup against an internal API. There is no tool that runs a command, reads files or the environment, or fetches an arbitrary URL — and that is the whole point.

---

### The security model

Once there is no dangerous primitive, the credentials look after themselves under three rules:

1. No dangerous tools. Nothing that runs a shell, executes code, or reads files, environment, or arbitrary URLs.
2. Keys never enter the model's context. They live only in the HTTP headers the code sets when it calls a tool — never in the prompt, a tool description, or a tool result.
3. Tools are read-only, and their errors are sanitized before they go back to the model.

The nice consequence: a prompt-injected model cannot leak a key it never sees, and it has no tool that could read one. I tested this — you can talk the bot into repeating its own system prompt (which is public and holds no secrets), but there is simply no path from chat to the API keys. The residual risk is a "confused deputy": coaxing the bot into looking up data its keys can already see. That is bounded by giving each key the narrowest scope possible, and it is a risk I can live with — it let me drop the sandbox and the secrets gateway entirely.

---

### Deployment

It runs as a tiny, non-root container on an internal Kubernetes cluster, using a fraction of a CPU and a few tens of megabytes of memory. Deployment is boring in the best way: push to git, a self-hosted CI runner builds the image and rolls it out, done. The behaviour I tune most — the system prompt and the trigger words — lives in a config map, so changing what the bot knows or how it talks needs no rebuild.

A few small touches earned their place along the way: the model call falls back to a second model on error; conversation memory is scoped to a chat thread and rebuilt from the thread on demand, so the bot stays stateless and survives a restart; and I added a couple of search tools once exact-match lookups turned out not to be enough in practice.

---

### What I learned

For a bounded problem, a framework mostly buys you an agent loop you could write yourself in an afternoon — and it charges for it in dependencies, build complexity, and surface area you have to trust. The version I kept is easier to read, easier to deploy, and easier to reason about precisely because it does less. And the strongest security control turned out not to be a clever sandbox, but the decision not to give the model anything dangerous to hold in the first place.
