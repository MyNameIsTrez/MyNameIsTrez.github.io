---
layout: post
title: "How to process a request like nginx does"
date: 2024-04-10 10:00:00 +0100
---

This post serves to explain nginx its technical [*How nginx processes a request*](https://nginx.org/en/docs/http/request_processing.html) page with snippets of C++ code taken from [my own web server](https://github.com/MyNameIsTrez/webserv).

If you clone that repository, you can follow along with the upcoming commands taken from the README's [*Running nginx*](https://github.com/MyNameIsTrez/webserv#running-nginx) header.

1. Start by building and running the Docker container with `docker build -t nginx nginx/ && docker run --rm -it -v $(pwd):/code -p 8080:80 -p 8081:81 nginx`
2. We're now inside of it, so run nginx with the command `nginx`
3. 

A minimal nginx.conf looks like this:

```nginx
TODO: Add a minimal conf 
```

nginx its documentation of the [server directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) explains that the `Host` HTTP header can be used to decide which virtual server a request should go to:

> Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers. Instead, the listen directives describe all addresses and ports that should accept connections for the server, and the server_name directive lists all server names.
