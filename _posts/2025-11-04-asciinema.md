---
layout: post
title: "Recording and Sharing Terminal Sessions with Asciinema"
date: 2025-11-04
author: hermanl0
categories: blog
---

<!-- Live Asciinema Player at the top -->
<script src="https://asciinema.org/a/HlKBip7QAmlbwshOuS1bKqE8p.js" id="asciicast-HlKBip7QAmlbwshOuS1bKqE8p" async="true"></script>

[View on Asciinema](https://asciinema.org/a/HlKBip7QAmlbwshOuS1bKqE8p)

[Asciinema](https://asciinema.org) is an open-source tool for recording and sharing terminal sessions.  
Instead of heavy video files, it saves text-based replays that can be played back interactively — perfect for tutorials, demos, and blog posts.

## Install Asciinema

On Ubuntu 24.04 LTS:

```bash
sudo apt update
sudo apt install asciinema -y
````

Verify the installation:

```bash
asciinema --version
```

## Record Your First Session

Start recording:

```bash
asciinema rec
```

You’ll see:

```
~ Asciinema recorder v3.0.0
~ Press <Ctrl-D> or type 'exit' when you're done recording.
```

Everything you type in the terminal is recorded until you exit with **Ctrl+D** or `exit`.

## Upload and Share

After finishing the recording, you can upload it to Asciinema:

```bash
asciinema upload your-session.cast
```

You’ll get a link like:

```
https://asciinema.org/a/HlKBip7QAmlbwshOuS1bKqE8p
```

## Local Playback

To play your recordings locally without uploading:

```bash
asciinema play your-session.cast
```


