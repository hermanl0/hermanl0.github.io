# basic mtr (my traceroute) command

-z: This flag removes the use of the IP TOS (Type of Service) field, making it zero. It's used to ensure that the mtr packets don't use any specific quality of service or precedence.

-t: This flag turns on the traditional traceroute display mode. It represents the output using a format similar to classic traceroute.

```
mtr -z -t 8.8.8.8 --report > mtr_out.txt 

less mtr_out.txt 

Start: 2024-04-24T15:06:28+0200  
...
13. AS15169  dns.google           
```

