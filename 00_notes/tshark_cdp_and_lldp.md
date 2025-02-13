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

# linux example

```bash
[user@machine ~]$# tshark -D
```

```bash
[user@machine ~]$#tshark -i eth0 -Y "(lldp) or (cdp)"
```

if you want to force a packet you can do the following on a cisco switch

```bash
switch#show cdp nei gi0/8 det
```
