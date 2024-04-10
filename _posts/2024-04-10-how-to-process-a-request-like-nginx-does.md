---
layout: post
title: "How to process a request like nginx does"
date: 2024-04-10 10:00:00 +0100
---

This post serves to explain nginx its technical [*How nginx processes a request*](https://nginx.org/en/docs/http/request_processing.html) page with snippets of C++ code taken from [my own web server](https://github.com/MyNameIsTrez/webserv).

If you clone that repository, you can follow along with these commands:

1. Start by building and running the nginx container with `docker build -t nginx nginx/ && docker run --name nginx --rm -it -v $(pwd):/code nginx`
2. We're now inside of it, so run nginx as a background process with the command `nginx &`, and check that it is running with `ps`
3. Run `curl localhost:8080` to request the contents of `a.html`, which is just the letter `a`

I used the `index` directive in the nginx.conf configuration file to let this virtual server default to returning `a.html`:

```nginx
server {
	listen localhost:8080;
	root /code;
	index public/a.html;
}
```

We can add another virtual server that listens on port `8081` by adding this in nginx.conf, so that `curl localhost:8081` prints `b`.

You don't need to restart nginx or the container, but you do need to run `nginx -s reload` in order to notify nginx to use the updated configuration file.

```nginx
server {
	listen localhost:8081;
	root /code;
	index public/b.html;
}
```

nginx its [documentation of the server directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) explains that the `Host` HTTP header can be used to decide which virtual server a request should go to:

> Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers. Instead, the listen directives describe all addresses and ports that should accept connections for the server, and the server_name directive lists all server names.

In order to understand this quote, you have to know that if you let both virtual servers listen on port 8080, rather than having them listen on port 8080 and 8081 respectively, we'll get this error:

> nginx: [warn] conflicting server name "" on 127.0.0.1:8080, ignored

This error makes sense, as nginx is basically complaining that if a HTTP request were to come in, it wouldn't know which virtual server it is meant to go to.
