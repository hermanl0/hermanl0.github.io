---
layout: post
title: "Automated iperf3 Reports to GitHub Pages"
date: 2024-02-12
author: hermanl0
categories: blog
---

I was curious about automating markdown reports using data I had gathered. Iperf3 is an excellent tool for conducting network performance tests, especially for Wi-Fi connections, which can vary based [...]

# The Flow

The python script listen continuously for new connections. When a new test is completed, a markdown file is created and pushed to the github repo, which displays all of the reports in a sorted way on [...]

![](/img/iperf-flow-dark.png)

## Dependencies

* iperf3 installed on a server, listening on port 5201
* iperf3 installed on a client, this can be an app on your phone
* a github repo


```yaml
(optional) _config.yml file: with the following

remote_theme: pages-themes/modernist@v0.2.0
plugins:
  - jekyll-remote-theme # add this line to the plugins list if you already have one

show_downloads: false
```

## The Script

```python
# ... your python script as before ...
```

When testing, it will look like this:

## iPhone Client

![](/img/iphone-iperf.png)

## Android Client

![](/img/android-iperf.png)

And finally, the results will be presented on this website:

## GitHub Pages

![](/img/pages_presentation.png)

## Individual Report

![](/img/iperf_report.png)

End
