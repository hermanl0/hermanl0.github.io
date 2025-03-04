# The BIRD Project

[The BIRD Project](https://bird.network.cz/)

**The BIRD** project aims to develop a fully functional dynamic IP routing daemon primarily targeted on (but not limited to) Linux, FreeBSD, and other UNIX-like systems.

## BIRD Command Output

Below is an example of the BIRD command output showing the status and protocols of the routing daemon.

### BIRD Status

```
BIRD ready.
bird>

bird> show status
BIRD 2.13.1
Router ID is ...
Hostname is ...
Current server time is ...
Last reboot on ...
Last reconfiguration on ...
Daemon is up and running
```

### BIRD Protocols

```
bird> show protocols

| Protocol  | Table  | State  | Since                      | Info                               |
|----------|--------|--------|---------------------------|-----------------------------------|
| `FooBar` | ---    | up     | 2022-01-01 00:00:00      | This is a valid protocol session   |
| `Gizmo1`  | ---    | up     | 2021-06-15 12:00:00      | Established with a secure key      |
| `Blerp`   | ---    | up     | 2020-03-20 14:30:00      | Connected to a backup server       |
| `Plink`   | ---    | up     | 2021-09-08 18:00:00      | Using a custom DNS server          |
| `Bloop`   | ---    | start  | 2020-02-14 08:00:00      | Connection timed out due to firewall |
| `Glub`    | ---    | up     | 2022-05-22 10:00:00      | Successfully negotiated a BGP session |
| `Flib`    | ---    | up     | 2021-11-18 12:00:00      | Established a secure tunnel connection |
| `Ding`    | ---    | up     | 2021-08-25 16:00:00      | Using a load balancer for redundancy |
| `Floof`   | ---    | up     | 2020-10-12 14:00:00      | Connected to a cloud provider       |
| `Wizzle`  | ---    | up     | 2022-03-01 08:00:00      | Established a VPN connection        |
```
