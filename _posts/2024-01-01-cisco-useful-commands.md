---
layout: post
title: "Useful Cisco Commands for Network Administration (IOS and NX-OS)"
date: 2024-01-01
author: hermanl0
categories: blog
---

As a network engineer, working with Cisco devices requires familiarity with both IOS and NX-OS commands. This guide covers essential commands that every network administrator should know when managing Cisco devices. When implementing the configurations, please verify which platform you are using as some commands may vary between IOS and NX-OS.

## Show Clock

Checking the system time is fundamental for troubleshooting and log correlation:

```shell
switch# show clock
10:50:34.146 CET Tue Feb 18 2025
Time source is NTP
```

## Show Running Configuration for Clock Manager

To view the clock manager configuration:

```shell
switch# show run clock_manager

!Command: show running-config clock_manager
!Running configuration last done at: Tue Feb 18 10:46:12 2025
!Time: Tue Feb 18 10:48:59 2025
```

## Set NTP Server

Proper time synchronization is crucial for network operations. Configure NTP with:

```shell
switch(config)# ntp server <ip> vrf use-vrf <default/management>
```

## Show Environment

Monitor hardware health including temperature sensors:

```shell
switch# show environment
...
Temperature:
--------------------------------------------------------------------
Module   Sensor        MajorThresh   MinorThres   CurTemp     Status
                        (Celsius)     (Celsius)    (Celsius)
--------------------------------------------------------------------
A        Sensor1         XX              XX        XX         OK
A        Sensor2         XX              XX        XX         OK
A        Sensor3         XX              XX        XX         OK
A        Sensor4         XX              XX        XX         OK
```

## Show Archive

Configuration archival is important for change management and recovery:

```shell
switch# show archive
The maximum archive configurations allowed is 10.
The archiving time-period is 1439 minutes.
The next archive will be in 1221 minutes.
Write-mem mode is enabled.
There are currently 2 archive configurations saved.
The next archive file will be named sftp://user:pass@[IPv6:address]/backup/device-xyz-confg-<timestamp>-2
 Archive #  Name
    1       sftp://user:pass@[IPv6:address]/export/home/user/backup/device-xyz-confg-<date-time>-0
    2       sftp://user:pass@[IPv6:address]/export/home/user/backup/device-xyz-confg-<date-time>-1 <- Most Recent
    3
```

## License Smart Transport

Disable Smart Licensing transport when offline management is required:

```shell
switch(config)# license smart transport off
```

This command prevents the device from communicating with the Cisco Smart Software Manager.

## Show SNMP OID Statistics Last Access

Monitor SNMP activity for troubleshooting purposes:

```shell
switch# show snmp oid-statistics last-access
-  SNMP Latest OID Stats                                                                  
Object ID Last Access TS   Last Access Last-polled NMS Rsp Time
```

The output displays the last access time for the specified OID, helping with SNMP monitoring verification.

## Show Interface Hardware Mappings

View hardware mapping information for interfaces:

```shell
switch# show interface hardware-mappings
...
       Slice - Slice Number. N/A for BCM systems
...

---------------------------
Name       Ifindex  Smod Unit HPort FPort NPort VPort Slice SPort SrcId MacId MacSP VIF  Block BlkSrcID
---------------------------
Eth1/1     1a000000 1    0    108   255   0     -1    1     36    72    27    0     1    1     0
Eth1/2     1a000200 1    0    112   255   4     -1    1     40    80    28    0     5    1     8
```

## Show Interface Status

Monitor operational status of all interfaces including speed, duplex, and VLAN assignment:

```shell
switch# show interface status
Port          Name               Status    Vlan      Duplex  Speed   Type
--------------------------------------------------------------------------------
Eth1/1        Uplink-Core        connected  routed    full    1000    1000base-T
Eth1/2        To-Distribution    connected  10        full    1000    1000base-T
Eth1/3        --                 disabled   1         full    1000    1000base-T
```

## Show IP Route

Display the IP routing table to verify network paths and routing protocol information:

```shell
switch# show ip route
IP Route Table for VRF "default"
'*' denotes best ucast next-hop
'**' indicates shared leak-vrf routes
'x' indicates backup next-hop
'%' indicates exclusive path
'+' indicates recursive entry
'&' indicates external path

'*' 10.0.0.0/24, ubest/mbest: 1/0
    *via 10.1.1.2, Eth1/1, [110/20], 01:15:22, ospf-1, intra
'*' 10.0.1.0/24, ubest/mbest: 1/0
    *via 192.168.1.1, Eth1/2, [110/30], 00:45:12, ospf-1, intra
```

## Show VLAN

List all configured VLANs with their IDs, names, and associated ports:

```shell
switch# show vlan

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Eth1/3, Eth1/4, Eth1/5
10   Production                       active    Eth1/2, Eth1/6, Eth1/7
20   Development                      active    Eth1/8, Eth1/9
30   Guest                            active    Eth1/10, Eth1/11
100  Management                       active    Eth1/12

VLAN Type         Vlan-mode
---- -----        ----------
1    enet         CE
10   enet         CE
20   enet         CE
30   enet         CE
100  enet         CE
```

## Show Processes CPU

Monitor CPU utilization by processes to identify performance bottlenecks:

```shell
switch# show processes cpu | head
CPU utilization for five seconds: 2%/0%; one minute: 3%; five minutes: 1%
PID    Runtime(ms)  Invoked   uSecs   Process
------ ----------- -------- ------- --------
1      1234567     123456   10000   init
2      234567      23456    10000   kmigratord
3      3456789     345678   10000   ksoftirqd/0
4      4567890     456789   10000   kworker/0:0
5      567890      56789    10000   kswapd0
```

## Show Logging

Display recent system logs for troubleshooting and monitoring events:

```shell
switch# show logging | tail
2025 Feb 18 10:30:15.123456 switch %ETHPORT-5-IF_DOWN: Interface Ethernet1/1 is down
2025 Feb 18 10:30:16.234567 switch %ETHPORT-5-IF_UP: Interface Ethernet1/1 is up
2025 Feb 18 10:32:22.345678 switch %LINEPROTO-5-UPDOWN: Line protocol on Interface Ethernet1/2, changed state to Down
2025 Feb 18 10:32:23.456789 switch %LINEPROTO-5-UPDOWN: Line protocol on Interface Ethernet1/2, changed state to Up
2025 Feb 18 10:35:44.567890 switch %PLATFORM-2-MOD_DETECT: Module 1 detected (Serial number ABC1234D567)
```

## Show Module

Display information about installed modules/line cards including status and hardware details:

```shell
switch# show module
Mod Ports             Module-Type                       Model          Status
--- ----- ------------------------------------- ---------------------- ----------
1   48    1000 Mbps Optical SFP on 48 GE PoE+  N9K-C9396PX            active *
2   48    1000 Mbps Optical SFP on 48 GE       N9K-C9396PX            active *
3   32    10 Gigabit Ethernet                   N9K-C93180YC-FX        active *
4   32    10 Gigabit Ethernet                   N9K-C93180YC-FX        active *

Mod  Sw              Hw     World-Wide-Name(s) (WWN)
---  -------------- ------ --------------------------------------------------
1    9.3(10)        1.1    NA
2    9.3(10)        1.1    NA
3    9.3(10)        1.0    NA
4    9.3(10)        1.0    NA
```

## Show MAC Address Table

Display learned MAC addresses and their associated interfaces and VLANs:

```shell
switch# show mac address-table
Legend:
        * - primary entry, G - Gateway MAC, (R) - Routed MAC, O - Overlay MAC
        age - seconds since last seen,+ - primary entry using vPC peer-gateway MAC

VLAN     MAC Address      Type      age     Secure NTFY Ports/SWID.SSID.LID
--------+----------------+--------+---------+------+----+------------------
* 1      0011.2233.4455   dynamic   0         F      F    Po10
* 10     aabb.ccdd.eeff   dynamic   300       F      F    Eth1/2
* 10     0012.3456.7890   dynamic   120       F      F    Eth1/6
* 20     aaaa.bbbb.cccc   dynamic   450       F      F    Eth1/8
```

