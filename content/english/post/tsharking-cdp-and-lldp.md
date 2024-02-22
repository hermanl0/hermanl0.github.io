---
title: "Tsharking Cdp and Lldp"
date: 2024-02-22T10:14:50+01:00
Description: ""
Tags: [networking]
Categories: []
---

This is a quick way of getting cdp or lldp information from a switch by plugging in your network cable in a port. Results may vary, depending on the configuration of the port. 

# windows example

```powershell
PS C:\Program Files\Wireshark> .\tshark.exe -i "\Device\NPF_{***}" -Y "(lldp) or (cdp)"
```

```powershell
711  15.099343 Cisco_12:31:03 → CDP/VTP/DTP/PAgP/UDLD CDP 502 Device ID: switch-01.nett.uio.no  Port ID: GigabitEthernet0/3 

```

