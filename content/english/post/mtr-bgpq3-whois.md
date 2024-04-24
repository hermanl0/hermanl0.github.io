---
title: "mtr,bgpq3,whois"
date: 2024-04-24T15:23:16+01:00
Description: ""
Tags: [bash]
Categories: []
DisableComments: true
---

these are some useful commands when gathering information on different IPs and AS numbers

# mtr (my traceroute)

```bash
mtr -z -t 8.8.8.8 --report > mtr_out.txt 

less mtr_out.txt 

Start: 2024-04-24T15:06:28+0200  
...
13. AS15169  dns.google           0.0%    10    8.2   8.1   7.9   8.3   0.2 
```

# whois

```
whois AS15169

ASNumber: 15169
ASName:         GOOGLE                                                                                                                                  
```

# bgpq3

```
user@ubuntu:~/Downloads$ bgpq3 -4 

ip prefix-list NN permit 8.8.4.0/24 
ip prefix-list NN permit 8.8.8.0/24 
```
