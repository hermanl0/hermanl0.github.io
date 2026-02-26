---
layout: post
title: "Lanmine 41: 10G Party"
date: 2026-02-26
author: hermanl0
categories: blog
---

<img src="/img/cybrpanda-171225.png" alt="Description" width="500">

## The Original Plan

Originally, We had designed a comprehensive infrastructure stack for Lanmine 41 built on Proxmox and Kubernetes. The architecture was ambitious and fully featured, with automation, monitoring, and all the bells and whistles you'd expect from a production-ready infrastructure.

You can check out the original planned infrastructure code at [github.com/Lanmine/lanmine_tech/tree/main/lanmine_41](https://github.com/Lanmine/lanmine_tech/tree/main/lanmine_41).

<img src="/img/glance2.png" alt="Description" width="1000">

<img src="/img/n8n_discord.PNG" alt="Description" width="500">

## Reality Check: Simplicity Wins

In the end, we chose not to use the Proxmox/Kubernetes stack this time. The deciding factors were:
- **Complexity**: The overhead of managing a full Kubernetes cluster for a LAN party
- **Time constraints**: We needed to get the network up and running quickly

Sometimes the best solution is the simplest one that works reliably.

## What We Actually Built

Instead of the complex virtualized infrastructure, we went with a straightforward network design:

### Network Architecture

**Gateway/Router:**
- Cisco Nexus 92160 as Layer 3 switch/gateway
- Direct connection to our ISP
- Basic access lists to protect the public /24 network routed to LAN participants

<img src="/img/main_fiber_hallway.JPG" alt="Description" width="500">

<img src="/img/IMG_1476.JPG" alt="Description" width="500">

**Core Network:**
- Another Nexus 92160 as the core switch
- Connected directly from the gateway

<img src="/img/core-sw1.JPG" alt="Description" width="500">

**Edge Network:**
- 10G-capable Catalyst 2960X switches as edge switches
- Star topology for easy management and troubleshooting
  
<img src="/img/lan_full2.JPG" alt="Description" width="500">

## Monitoring Setup

We set up basic monitoring from the gateway using:
- Discord webhook for alerts
- SNMP monitoring for network stats
  
<img src="/img/nexus_webhook_discord.PNG" alt="Description" width="500">

## Speed test

<img src="/img/iperf-10G.png" alt="Description" width="500">

## Future Plans

Looking ahead to future events, we have some key goals:

### Redundancy
- Implement dual core switches for high availability
- No more single points of failure

### Out-of-Band Management
I'm planning to experiment with:
- **Opengear** for console server access
- **Tailscale** for secure remote connectivity
- Goal: Maximum out-of-band connection options for troubleshooting

All in all, it was a great event. Our 10G connection ran smoothly throughout.
