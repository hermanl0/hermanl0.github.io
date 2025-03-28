# adding ssh key to github

SSH Setup:

on your machine, generate a new SSH key pair by running the following command in your terminal:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

once generated, add your new key to the ssh-agent:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

copy your SSH public key:

```bash
cat ~/.ssh/id_rsa.pub
```

add key to github

clone the repository with the command:

```bash
git clone git@github.com:YourUserName/YourRepoName.git
```

replace "YourUserName/YourRepoName.git" with your Github username and the repository name.
