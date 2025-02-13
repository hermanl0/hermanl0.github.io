# network info in powershell

this is a script which summarizes a few useful network commands in powershell

```powershell
Clear-Host

# Get client network information
$networkInfo = @{
    IPAddress = (Get-NetIPAddress -AddressFamily IPv4).IPAddress
    DefaultGateway = (Get-NetRoute -DestinationPrefix 0.0.0.0/0).NextHop
    MACAddress = (Get-NetAdapter -Physical | Where-Object { $_.Status -eq "Up" }).MacAddress
    DNSServers = (Get-DnsClientServerAddress -AddressFamily IPv4).ServerAddresses
    DnsSuffixSearchList = (Get-DnsClientGlobalSetting).SuffixSearchList
}

# Perform ARP scan to discover other clients on the network
$arpScan = arp -a

# Get network interface information
$interfaces = Get-NetAdapter | Select-Object Name, Status, LinkSpeed, InterfaceType

# Display client network information
Write-Host "Client Network Information"
Write-Host "---------------------------"
Write-Host "IP Address:                 $($networkInfo.IPAddress)"
Write-Host "Default Gateway:            $($networkInfo.DefaultGateway)"
Write-Host "MAC Address:                $($networkInfo.MACAddress)"
Write-Host "DNS Servers:                $($networkInfo.DNSServers -join ', ')"
Write-Host "DNS Suffix Search List:     $($networkInfo.DnsSuffixSearchList -join ', ')"
Write-Host ""

# Display other clients on the network
Write-Host "Other Clients on the Network"
Write-Host "---------------------------"
$arpScan | ForEach-Object {
    $ip = ($_ -split '\s+')[1]
    $mac = ($_ -split '\s+')[2]
    Write-Host "IP Address: $($ip), MAC Address: $($mac)"
}
Write-Host ""

# Display network interface information
Write-Host "Network Interface Information"
Write-Host "-------------------------------"
$interfaces | Format-Table
```

# output 

```
---------------------------
IP Address:                 192.168.1.2 192.168.1.3 192.168.1.4 10.0.0.5 192.168.1.5 127.0.0.1
Default Gateway:            10.0.0.1
MAC Address:                BA-D1-DA-C0-FF-EE
DNS Servers:                10.0.0.10, 10.0.0.20, 10.0.0.30    
DNS Suffix Search List:     example.com, sub.example.com, another.com, clients.example.com

Other Clients on the Network
---------------------------
IP Address: , MAC Address: 
IP Address: 10.0.0.5, MAC Address: ---
IP Address: 172.16.0.1, MAC Address: Address
IP Address: 10.0.0.1, MAC Address: BA-D1-DA-C0-FF-EE 
IP Address: 10.0.0.2, MAC Address: BA-D1-DA-C0-FF-EE 
IP Address: 10.0.0.3, MAC Address: BA-D1-DA-C0-FF-EE 
IP Address: 10.0.0.4, MAC Address: BA-D1-DA-C0-FF-EE 
...
IP Address: 10.0.0.49, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 10.0.0.50, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 172.16.10.1, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 172.16.10.2, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 224.0.0.5, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 224.0.0.10, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 239.255.255.250, MAC Address: BA-D1-DA-C0-FF-EE
IP Address: 255.255.255.255, MAC Address: BA-D1-DA-C0-FF-EE

Network Interface Information
-------------------------------

Name                         Status       LinkSpeed InterfaceType
----                         ------       --------- -------------
Wi-Fi                        Disconnected 0 bps                71
Ethernet                     Up           1 Gbps                6
Bluetooth Network Connection Disconnected 3 Mbps                6
```
