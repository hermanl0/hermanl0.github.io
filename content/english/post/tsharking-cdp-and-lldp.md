---
title: "tsharking cdp and lldp"
date: 2024-02-22T10:14:50+01:00
Description: ""
Tags: [networking]
Categories: []
---

This is a quick way of getting cdp or lldp information from a switch by plugging in your network cable in a port. Results may vary, depending on the configuration of the port.

# windows example

locate your interface with

```powershell
C:\Program Files\Wireshark> .\tshark.exe -D
```

start capturing:

```powershell
PS C:\Program Files\Wireshark> .\tshark.exe -i "\Device\NPF_{***}" \
    -Y "(lldp) or (cdp)"

711  15.099343 Cisco_12:31:03 → CDP/VTP/DTP/PAgP/UDLD CDP 502 \
Device ID:switch-01.domain.com  Port ID: GigabitEthernet0/3
```
