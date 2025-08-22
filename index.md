---
layout: home
title: Home
---

Welcome to my personal blog and portfolio! This site is built with Jekyll and hosted on GitHub Pages.

## Latest Blog Posts

{% for post in site.posts %}
### [{{ post.title }}]({{ post.url }})
*{{ post.date | date: "%Y" }}*

{{ post.excerpt }}

---
{% endfor %}

## About Me

I'm a technology enthusiast with interests in artificial intelligence, networking, and open-source software. This blog is where I share my experiences, tutorials, and insights on various tech topics.

## Connect With Me

- 📧 Email: [hermanl0@proton.me](mailto:hermanl0@proton.me)
- 💼 LinkedIn: [Herman Loennechen](https://www.linkedin.com/in/hermanl0/)
- 🐱 GitHub: [hermanl0](https://github.com/hermanl0)

---
*Subscribe to the [RSS Feed](feed.xml) to stay updated with my latest posts.*
