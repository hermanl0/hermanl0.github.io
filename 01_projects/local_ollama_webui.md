https://github.com/open-webui/open-webui + 

https://ollama.com/ is pretty cool and easy to set up.

![](../img/local-llm.png)

## prepare ubuntu

In this example I used a fresh Ubuntu 24.04 LTS install.

```bash
sudo apt update
...
sudo apt upgrade
...
````

## install ollama

```bash
https://ollama.com/download

user01@ubuntu:~$ curl -fsSL https://ollama.com/install.sh | sh
```

pull and run llama3

```bash
user01@ubuntu:~$ ollama run llama3
pulling manifest 
pulling 6a0746a1ec1a...  12% ▏ 562 MB/4.7 GB   87 MB/s
```


## install docker

Reference: https://get.docker.com

```bash
user01@ubuntu:~$  curl -fsSL https://get.docker.com -o install-docker.sh

user01@ubuntu:~$ sh install-docker.sh --dry-run
# Executing docker install script, commit: ...
```

## verify that docker is working

```bash
user01@ubuntu:~$docker pull hello-world

user01@ubuntu:~$docker run hello-world

Hello from Docker!
...
```

## install open web ui 

https://docs.openwebui.com/

```bash
user01@ubuntu:~$ sudo docker run -d -p 8080:8080 --network=host -v 
/media/jeremy/
docker/data/open-webui:/app/backend/data -v
/media/jeremy/docker/docs:/data/docs -e 
OLLAMA_BASE_URL=http://127.0.0.1:11434 
--name open-webui --restart always 
ghcr.io/open-webui/open-webui:main
```

now your web server should be available at port 8080. The first account you create will be an admin account.

![](../img/open-web-ui-sign-in-up.jpg)

next, you can enable memories: Settings - Personalization - Memory

![](../img/apple-memory.jpg)

now your local llm will also remember the implanted memories:

![](../img/apples-prefer-oranges.jpg)
