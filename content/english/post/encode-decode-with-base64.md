---
title: "Encode Decode With Base64"
date: 2024-02-28T11:32:24+01:00
Description: ""
Tags: [bash]
Categories: []
---


```bash
base64 -i example-config.txt > base64-encoded.txt
more base64-encoded.txt
Y29uZmlnIHRleHQK
```
```bash
base64 -d -i base64-encoded.txt > base64-decoded.txt
more base64-decoded.txt
config text
```
