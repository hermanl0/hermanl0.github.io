---
title: "mtr,whois,bgpq3"
date: 2024-04-24T15:23:16+01:00
Description: ""
Tags: [bash]
Categories: []
DisableComments: true
---

these are some useful commands when gathering information on different IPs and AS numbers

# mtr (my traceroute)

```
mtr -z -t 8.8.8.8 --report > mtr_out.txt 

less mtr_out.txt 

Start: 2024-04-24T15:06:28+0200  
...
13. AS15169  dns.google           
```

# whois

```
whois AS15169

ASNumber: 15169
ASName:         GOOGLE                                                                                                                                  
```

# bgpq3

```
user@ubuntu:~/Downloads$ bgpq3 -4 15169

ip prefix-list NN permit 8.8.4.0/24 
ip prefix-list NN permit 8.8.8.0/24 
```
