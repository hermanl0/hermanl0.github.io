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

Here is the replaced text:

Name         Proto  Table  State  Since                 Info
Foobar       Gizmo   ---    up     2022-01-01 00:00:00   Whirlybird
Groggle      Razzle  ---    up     2021-06-15 12:00:00   Flibberflam
Wizzleplop   Dazzle  ---    up     2020-03-20 14:30:00   Flutterby
Plinkity    Bloopie  ---    up     2021-09-08 18:00:00   Wugglepants <=> Flimflam
Blerg       Whimsy  ---    up     2023-09-18 12:15:22   Established
Flish       Ploofy  ---    start  2020-02-14 08:00:00   Connect       Jigglypuff: No route to host
Glorp       Glint  ---    up     2022-05-22 10:00:00   Established
Flumplenook  Snazzle  ---    up     2021-11-18 12:00:00   Sparkles
Dingdong    Flibulon  ---    up     2021-08-25 16:00:00   Wizzlewhack <=> Wumplenook
Wumplenook  Flazzle  ---    up     2020-10-12 14:00:00   Fiddledee <=> Fiddledee
Wizzlewhack  Wizzle  ---    up     2022-03-01 08:00:00   Flibberflam <=> Flibberflam
```
