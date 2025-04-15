# Cisco NX-OS Notes

## Show Clock

```shell
switch# show clock
10:50:34.146 CET Tue Feb 18 2025
Time source is NTP
```

## Show Running Configuration for Clock Manager

```shell
switch# show run clock_manager

!Command: show running-config clock_manager
!Running configuration last done at: Tue Feb 18 10:46:12 2025
!Time: Tue Feb 18 10:48:59 2025
```

## Set NTP server
```
switch(config)#ntp server <ip> vrf use-vrf <default/management>
```

## Show Environment

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

```shell
switch# show archive
The maximum archive configurations allowed is 10.
The archiving time-period is 1439 minutes.
The next archive will be in 1221 minutes.
Write-mem mode is enabled.
There are currently 2 archive configurations saved.
The next archive file will be named sftp://user:pass@[IPv6:address]/backup/device-xyz-confg-<timestamp>-2
 Archive #  Name
    1       sftp://user:pass@[IPv6:address]/backup/device-xyz-confg-<date-time>-0
    2       sftp://user:pass@[IPv6:address]/backup/device-xyz-confg-<date-time>-1 <- Most Recent
    3
```

## License smart transport

The `license smart transport off` command is used in Cisco devices to disable the Smart Licensing transport. This command prevents the device from communicating with the Cisco Smart Software Manager.

```shell
switch#(config)license smart transport off
```

## Show SNMP OID Statistics Last Access
The output of the command will typically display the last access time for the specified OID, formatted as a timestamp. The exact output format may vary depending on the SNMP agent and OID being queried.

```shell
switch# show snmp oid-statistics last-access
```
