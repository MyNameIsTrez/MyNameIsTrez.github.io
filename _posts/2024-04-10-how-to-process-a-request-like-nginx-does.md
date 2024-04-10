---
layout: post
title: "How to process a request like nginx does"
date: 2024-04-10 10:00:00 +0100
---

This post serves to explain nginx its technical [*How nginx processes a request*](https://nginx.org/en/docs/http/request_processing.html) page with snippets of C++ code taken from [my own web server](https://github.com/MyNameIsTrez/webserv).

# Understanding nginx's behavior

If you clone that repository, you can follow along with these commands:

1. Start by building and running the nginx container with `docker build -t nginx nginx/ && docker run --name nginx --rm -it -v $(pwd):/code nginx`
2. We're now inside of it, so run nginx as a background process with the command `nginx &`, and check that it is running with `ps`
3. Run `curl localhost:8080` to request the contents of `a.html`, which is just the letter `a`

I used the `index` directive in the nginx.conf configuration file to let this virtual server default to returning `a.html`:

```nginx
server {
	listen 8080;
	root /code;
	index public/a.html;
}
```

We can add another virtual server that listens on port `8081` by adding this in nginx.conf, so that `curl localhost:8081` prints `b`.

You don't need to restart nginx or the container, but you do need to run `nginx -s reload` in order to notify nginx to use the updated configuration file.

```nginx
server {
	listen 8081;
	root /code;
	index public/b.html;
}
```

If you let both virtual servers listen on port 8080, rather than having them listen on port 8080 and 8081 respectively, you'll get this error:

> nginx: [warn] conflicting server name "" on 127.0.0.1:8080, ignored

This error makes sense, as nginx is basically complaining that if a HTTP request were to come in, it wouldn't know which virtual server it is meant to go to.

There are two ways to get rid of this error, which is what this blog post is about.

## Solution 1: Using different addresses

So far we've only specified the port, and not the address in either of these `listen` directives, since [it's optional](https://nginx.org/en/docs/http/ngx_http_core_module.html#listen).

If we do explicitly give the second virtual server an address, we can have both virtual servers use the same port, where `curl localhost:8080` will print `a` and `curl 127.0.0.2:8080` will print `b`:

```nginx
server {
	listen 8080;
	root /code;
	index public/a.html;
}

server {
	listen 127.0.0.2:8080;
	root /code;
	index public/b.html;
}
```

## Solution 2: Using different server_names

nginx its [documentation of the server directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) explains that the `Host` HTTP header can be used to decide which virtual server a request should go to:

> Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers. Instead, the listen directives describe all addresses and ports that should accept connections for the server, and the server_name directive lists all server names.

As mentioned earlier, if you let both virtual servers listen on port 8080, you'll get this error:

> nginx: [warn] conflicting server name "" on 127.0.0.1:8080, ignored

This error makes sense, as nginx is basically complaining that if a HTTP request were to come in, it wouldn't know which virtual server it is meant to go to.

The `conflicting server name ""` part is hinting that both virtual servers have the default name of an empty string, so if we the second virtual server a different name, we get rid of the error:

```nginx
server {
	listen 8080;
	root /code;
	index public/a.html;
}

server {
	listen 8080;
	server_name bar;
	root /code;
	index public/b.html;
}
```

Okay, but what does this achieve?

Well, if we tell curl to be verbose with the `-v` flag, we get a lot of useful information with `curl -v localhost:8080`:

```sh
/code # curl -v localhost:8080
*   Trying 127.0.0.1:8080...
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET / HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.79.1
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Server: nginx
< Date: Wed, 10 Apr 2024 09:34:03 GMT
< Content-Type: text/html
< Content-Length: 2
< Last-Modified: Wed, 10 Apr 2024 07:54:42 GMT
< Connection: keep-alive
< ETag: "661645c2-2"
< Accept-Ranges: bytes
< 
a
* Connection #0 to host localhost left intact
/code #
```

These are the first observations from this blob of text:

1. Every line starting with `*` is nginx's log telling you what it's currently doing
2. Every line starting with `>` is a HTTP header that we're sending with curl
3. Every line starting with `<` is a HTTP header from the server's response
4. The `a` at the bottom is the response's body

What's relevant right now is what curl is sending to the server, so we'll just look at the `>` lines:

1. We're connecting to address `127.0.0.1` on port `8080`
2. We're doing a GET request to the server's `/` route, which is the root directory
3. The `Host` header has the value `localhost:8080`

The `Host` header value of `localhost:8080` doesn't match the second virtual server's `bar` server_name, nor the first virtual server's default empty name.

So the reason the response is `a`, and not `b`, even though they both listen on `localhost:8080`, is because nginx just defaults to the first virtual server if none of the names match the `Host` value.

We can prove this by overriding the `Host` header so it has `server_name bar;` its name, by running `curl -v localhost:8080 --header 'Host: bar'`:

```sh
/code # curl -v localhost:8080 --header 'Host: bar'
*   Trying 127.0.0.1:8080...
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET / HTTP/1.1
> Host: bar
> User-Agent: curl/7.79.1
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Server: nginx
< Date: Wed, 10 Apr 2024 09:56:59 GMT
< Content-Type: text/html
< Content-Length: 2
< Last-Modified: Wed, 10 Apr 2024 07:54:42 GMT
< Connection: keep-alive
< ETag: "661645c2-2"
< Accept-Ranges: bytes
< 
b
* Connection #0 to host localhost left intact
/code #
```

So this time around we see `> Host: bar` instead of `> Host: localhost:8080`, and the body being `b` instead of `a`.

The important takeaway here is that nginx has no way of knowing which virtual server a request belongs to, until at least the `Host` header has been fully read.

So if you're trying to replicate nginx in your own web server, I recommend reading the entire header and storing it as a map, before deciding which C++ Server class instance any incoming request belongs to.

# My C++ implementation
