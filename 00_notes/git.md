---
layout: default
title: Git Reset, Branch, and Rebase Documentation
---

**Git Reset, Branch, and Rebase Documentation**
=====================================================

**Table of Contents**

1. [Introduction](#introduction)
2. [Git Reset](#git-reset)
3. [Git Branching](#git-branching)
4. [Git Rebase](#git-rebase)
5. [Git Log and History Commands](#git-log-and-history-commands)
6. [Committing, Pushing, and Pulling](#committing-pushing-and-pulling)

**Git Reset, Branch, and Rebase Documentation**
=====================================================

### Introduction

Git is a powerful version control system that allows developers to track changes to their codebase. However, as projects grow and evolve, managing the Git repository can become complex. 

### Git Reset

The `git reset` command is used to reset the current branch to a previous commit. This can be useful for reverting changes, discarding work, or recovering from mistakes.

### Git Branching

The `git branch` command is used to create, list, or delete branches in the Git repository. Branching is a fundamental concept in Git that allows developers to work on different features or versions of a project simultaneously.

### Git Rebase

The `git rebase` command is used to reapply commits on top of another base commit. Rebase is a powerful tool for maintaining a linear history and squashing commits.

### Git Log and History Commands

The following Git commands are useful for navigating and understanding the commit history of your repository:

#### Git Log

The `git log` command displays a condensed version of the commit history.

**Example Usage**

```bash
$ git log
$ git log --oneline
$ git log --pretty=format:"%h %ad | %s%d [%an]" --date=short
```

#### Git Show

The `git show` command displays the details of a specific commit or file.

**Example Usage**

```bash
$ git show HEAD
$ git show HEAD~1
$ git show <commit_hash>
```

#### Git Status

The `git status` command displays the current state of your working directory, including any unstaged and staged changes.

**Example Usage**

```bash
$ git status
$ git status -s
$ git status -uno
```

#### Git Cherry-Pick

The `git cherry-pick` command applies a specific commit to the current branch.

**Example Usage**

```bash
$ git cherry-pick <commit_hash>
$ git cherry-pick HEAD~1
$ git cherry-pick --no-commit <commit_hash>
```

### Adding, Committing, Pushing, and Pulling

**Git Add**

The `git add` command stages changes in your working directory, preparing them for commit.

**Example Usage**

```bash
$ git add <file>
$ git add .
```

**Git Commit**

The `git commit` command commits the staged changes with a descriptive message.

**Example Usage**

```bash
$ git commit -m "<commit_message>"
```

**Git Push**

The `git push` command pushes your committed changes to a remote repository.

**Example Usage**

```bash
$ git push origin <branch_name>
```

**Git Pull**

The `git pull` command fetches and merges changes from a remote repository into your local repository.

**Example Usage**

```bash
$ git pull origin <branch_name>
```
