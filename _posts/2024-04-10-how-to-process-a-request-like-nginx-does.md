---
layout: post
title: "How to process a request like nginx does"
date: 2024-04-10 10:00:00 +0100
---

This post serves to explain nginx its technical [*How nginx processes a request*](https://nginx.org/en/docs/http/request_processing.html) page with snippets of C++ code taken from [my own web server](https://github.com/MyNameIsTrez/webserv).

If you clone that repository, you can follow along with these commands:

1. Start by building and running the nginx container with `docker build -t nginx nginx/ && docker run --name nginx --rm -it -v $(pwd):/code nginx`
2. We're now inside of it, so run nginx with the command `nginx`
3. Open a second terminal, and run `docker exec -it nginx sh` to jump into the same container
4. Run `curl localhost:8080` to request the contents of `a.html`, which is just the letter `a`

I used the `index` directive in the nginx.conf configuration file to let this virtual server default to returning `a.html`:

```nginx
server {
	listen localhost:8080;
	root /code;
	index public/a.html;
}
```

We can add another virtual server that listens on port `8081` by adding this in nginx.conf:

```nginx
server {
	listen localhost:8081;
	root /code;
	index public/b.html;
}
```

nginx its documentation of the [server directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) explains that the `Host` HTTP header can be used to decide which virtual server a request should go to:

> Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers. Instead, the listen directives describe all addresses and ports that should accept connections for the server, and the server_name directive lists all server names.
