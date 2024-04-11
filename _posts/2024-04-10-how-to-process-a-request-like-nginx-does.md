---
layout: post
title: "How to process a request like nginx does"
date: 2024-04-10 12:00:00 +0100
---

After having helped a handful of people with the project, I've decided to write this blog post about [my webserv project](https://github.com/MyNameIsTrez/webserv) I did 4 months ago at [Codam](https://www.codam.nl/en/).

Lots of example code is used to show why mimicking nginx its behavior accurately is hard, explaining stuff that was a mystery to me at the time along the way, like why you absolutely should use `getaddrinfo()`.

At the bottom of the page is a nice Python description of the ugly C++ code, which can hopefully save a few people the weeks I had to spend figuring this stuff out back then. :-)

# Understanding nginx

nginx its [*How nginx processes a request*](https://nginx.org/en/docs/http/request_processing.html) page is very technical, so let's break it down step by step.

## Setup

1. Start by creating an `nginx_docker` directory, and `cd` into it.
2. Create an `a.html` file in there containing just the letter `a`, and a `b.html` containing just the letter `b`.
3. Create an `nginx.conf` file in there containing this:

```nginx
server {
	listen 8080;
	root /code;
	index a.html;
}
```

{:start="4"}
4. Create a `Dockerfile` file in there containing this:

```Dockerfile
# Use a tiny Linux distribution
FROM alpine:3.13

# Install curl and nginx
RUN apk update && apk add curl nginx

# Fixes "nginx: [emerg] open() "/run/nginx/nginx.pid" failed
# (2: No such file or directory)"
RUN mkdir --parents /run/nginx

# nginx looks for default.conf, so link it to where our nginx.conf will be
# in our volume once we run the container
# -f stands for force, replacing the file that was there
# -s stands for symbolic link, which is like a Shortcut on Windows, or a C pointer
RUN ln -fs /code/nginx.conf /etc/nginx/conf.d/default.conf
```

## Running

1. Build and run the nginx container with `docker build --tag nginx . && docker run --rm --interactive --tty --name nginx --volume $(pwd):/code nginx`
2. We're now inside of it, so run nginx as a background process with the command `nginx`, and check that it is running with `ps`
3. Run `curl localhost:8080` to request the contents of `a.html`, which is just the letter `a`

## Explanation

I used the `index` directive in the nginx.conf configuration file to let this virtual server (also called a server directive) default to returning `a.html`:

```nginx
server {
	listen 8080;
	root /code;
	index a.html;
}
```

We can add another virtual server that listens on port `8081` by adding this in nginx.conf, so that `curl localhost:8081` prints `b`.

You don't need to restart nginx or the container, but you do need to run `nginx -s reload` in order to notify nginx to use the updated configuration file.

```nginx
server {
	listen 8081;
	root /code;
	index b.html;
}
```

If you let both virtual servers listen on port 8080, rather than having them listen on port 8080 and 8081 respectively, you'll get this error:

> nginx: [warn] conflicting server name "" on 127.0.0.1:8080, ignored

This error makes sense, as nginx is basically complaining that if a HTTP request were to come in, it wouldn't know which virtual server it is meant to go to.

There are two ways to get rid of this error, which is what this blog post is about.

## Solution 1: Using different addresses

So far we've only specified the port, and not the address in either of these `listen` directives, since [it's optional](https://nginx.org/en/docs/http/ngx_http_core_module.html#listen), and [listens to any address by default](https://github.com/nginx/nginx/blob/92f99685717e857de9ffa96993601a90803eb0d8/src/core/ngx_inet.c#L954-L958).

If we do explicitly give the second virtual server an address, we can have both virtual servers use the same port, where `curl localhost:8080` will print `a` and `curl 127.0.0.2:8080` will print `b`:

```nginx
server {
	listen 8080;
	root /code;
	index a.html;
}

server {
	listen 127.0.0.2:8080;
	root /code;
	index b.html;
}
```

## Solution 2: Using different server_names

nginx its [documentation of the server directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) explains that the `Host` HTTP header can be used to decide which virtual server a request should go to:

> Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers. Instead, the listen directives describe all addresses and ports that should accept connections for the server, and the server_name directive lists all server names.

If you look at this quote with this error we mentioned earlier in mind, when you let both virtual servers listen on the same address and on the same port:

> nginx: [warn] conflicting server name "" on 127.0.0.1:8080, ignored

The `conflicting server name ""` part hints that both virtual servers have the default name, namely an empty string.

So if we give the second virtual server a different `server_name`, we can get rid of the error:

```nginx
server {
	listen 8080;
	root /code;
	index a.html;
}

server {
	listen 8080;
	server_name bar;
	root /code;
	index b.html;
}
```

Okay, but what does this achieve?

Well, to be able to appreciate it we have to look a bit deeper into what we're actually sending with curl.

If we tell curl to be verbose with the `-v` flag, we get a lot of useful information, so we run `curl -v localhost:8080`:

```sh
/ # curl -v localhost:8080
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
< Date: Thu, 11 Apr 2024 09:21:42 GMT
< Content-Type: text/html
< Content-Length: 2
< Last-Modified: Wed, 10 Apr 2024 17:52:17 GMT
< Connection: keep-alive
< ETag: "6616d1d1-2"
< Accept-Ranges: bytes
< 
a
* Connection #0 to host localhost left intact
/ #
```

This is a lot of text, but let's start with some high-level observations:

1. Every line starting with `*` is nginx's log telling you what it's currently doing
2. Every line starting with `>` is a HTTP header that we're sending with curl
3. Every line starting with `<` is a HTTP header from the server's response
4. The `a` at the bottom is the response's body

What's relevant right now is what curl is sending to the server, so we'll just look at the `>` lines:

1. We're connecting to address `127.0.0.1` on port `8080`
2. We're doing a GET request to the server's `/` route, which is the root directory
3. The `Host` header has the value `localhost:8080`

The `Host` header value of `localhost:8080` doesn't match the second virtual server's `bar` server_name, nor the first virtual server's default empty name.

So the reason the response is `a`, and not `b`, even though they both listen on `localhost:8080`, is because nginx just defaults to the first virtual server if none of the candidate server names match the `Host` value.

We can prove this by giving the `Host` header a value of `bar` by running `curl -v localhost:8080 --header 'Host: bar'`:

```sh
/ # curl -v localhost:8080 --header 'Host: bar'
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
< Date: Thu, 11 Apr 2024 09:22:36 GMT
< Content-Type: text/html
< Content-Length: 2
< Last-Modified: Wed, 10 Apr 2024 17:52:20 GMT
< Connection: keep-alive
< ETag: "6616d1d4-2"
< Accept-Ranges: bytes
< 
b
* Connection #0 to host localhost left intact
/ #
```

So this time around we see `> Host: bar` instead of `> Host: localhost:8080`, and the response's body being `b` instead of `a`.

The important takeaway here is that nginx can't always know which virtual server a request belongs to before the `Host` header has been read.

So if you're trying to mimic nginx in your own web server, I recommend reading the entire header into a map, before deciding which Server class instance an incoming request belongs to. I personally even chose to read the entire body before deciding which Server instance any request belongs to.

# My C++ implementation

If you're starting out writing a web server in C++ right now, I highly recommend you make a small `client.cpp` and `server.cpp` to experiment in, to get yourself familiar with the fundamentals. [This C network programming playlist](https://www.youtube.com/watch?v=bdIiTxtMaKA&list=PL9IEJIKnBJjH_zM5LnovnoaKlXML5qh17) by Jacob Sorber was an excellent introduction for me, and showcases how to write a simple client and server.

I also recommend creating a program for every single function you're planning to use that you're not 100% familiar with, like my [experiments/getaddrinfo.cpp](https://github.com/MyNameIsTrez/webserv/blob/main/experiments/getaddrinfo.cpp), [experiments/readdir.cpp](https://github.com/MyNameIsTrez/webserv/blob/main/experiments/readdir.cpp), [experiments/stat.cpp](https://github.com/MyNameIsTrez/webserv/blob/main/experiments/stat.cpp), and so on.

## Why getaddrinfo()

nginx accepts this config, where `curl localhost:8080` prints `a` and `curl localhost:8080 --header 'Host: foo'` prints `b`:

```nginx
server {
	listen localhost:8080;
	root /code;
	index a.html;
}

server {
	listen 127.0.0.1:8080;
	server_name foo;
	root /code;
	index b.html;
}
```

Mimicking this behavior requires `getaddrinfo()`. This is because even though the addresses `localhost` and `127.0.0.1` are different strings, they refer to the same address on your computer.

You could of course hardcode translating any occurrence of `localhost` to `127.0.0.1`, but `getaddrinfo()` its job is to translate it (and other aliases) for you!

So `getaddrinfo()` tells you that both virtual servers have identical `address:port` pairs, which allows you to only call `socket()` and `bind()` once.

If you were to call `bind()` for both of them, you'd get the error `Address already in use`, and there'd be no way for your program to know which virtual servers should and shouldn't share a socket.

## Python pseudocode

While working on my web server my main priority was accuracy, and not readability, but hopefully this Python pseudocode can help *you* achieve both. :-)

### getaddrinfo()

From Config.cpp its `_fillBindInfoToServerIndices()` [here](https://github.com/MyNameIsTrez/webserv/blob/03d9f5339a5bb764839492f041ba0f942b5ed028/src/config/Config.cpp#L268-L321):

```py
# Used to throw if a `server_name` is seen for a second time on the same `address:port`
names_of_bind_info = {}

for server_index, server in enumerate(servers):
	bind_infos_in_server = set()

	for listen in server.listens:
		# getaddrinfo() returns a linked list, but my C++ code is lazy
		# and just assumes the first node is the only one we need
		# This seemed to work™, but is almost certainly the wrong way to do it
		bind_info = getaddrinfo()

		# Raise an error if a server has both `listen localhost:8080;` and `listen 127.0.0.1:8080;`
		if bind_info in bind_infos_in_server:
			raise DuplicateBindInfoInServer

		bind_infos_in_server.add(bind_info)

		# The [] operator in C++ creates the vector for us if it doesn't exist yet
		bind_info_to_server_indices[bind_info].append(server_index)

		for server_name in server.server_names:
			# Raise an error if any server with the same bind_info already used this server_name
			if server_name in names_of_bind_info[bind_info]:
				raise ConflictingServerName

			names_of_bind_info[bind_info].add(server_name)
```

### socket() => bind() => listen()

From Server.cpp its constructor [here](https://github.com/MyNameIsTrez/webserv/blob/03d9f5339a5bb764839492f041ba0f942b5ed028/src/Server.cpp#L27-L62):

```py
for bind_info, server_indices in config.bind_info_to_server_indices:
	socket_fd = socket()

	socket_fd_to_server_indices[socket_fd] = server_indices

	bind(socket_fd, bind_info)

	listen(socket_fd)

	# Adds socket_fd to poll() its array of fds,
	# stores that this is a SERVER fd, and turns its POLLIN on
	addFd(socket_fd, SERVER, POLLIN)
```

### acceptClient()

From Server.cpp its `_acceptClient()` [here](https://github.com/MyNameIsTrez/webserv/blob/03d9f5339a5bb764839492f041ba0f942b5ed028/src/Server.cpp#L483-L498):

```py
def acceptClient(socket_fd):
	client_fd = accept(socket_fd)

	addFd(client_fd, CLIENT, POLLIN);

	clients.append(Client(client_fd, socket_fd))
```

### getServerIndex()

From Server.cpp its `_getServerIndexFromClientServerName()` [here](https://github.com/MyNameIsTrez/webserv/blob/03d9f5339a5bb764839492f041ba0f942b5ed028/src/Server.cpp#L1051-L1067):

```py
def getServerIndex(client):
	server_indices = socket_fd_to_server_indices[client.socket_fd]

	for server_index in server_indices:
		server = config.servers[server_index]
		for server_name in server.server_names:
			if server_name == client.server_name:
				return server_index

	# If there was no server_name match, nginx defaults to the first server
	return server_indices[0]
```

### readFromClient()

From Server.cpp its `_readFd()` [here](https://github.com/MyNameIsTrez/webserv/blob/03d9f5339a5bb764839492f041ba0f942b5ed028/src/Server.cpp#L560-L729):

```py
received = read(fd)

client.appendReceived(received)

if client.everythingReceived():
	server_index = getServerIndex(client)
	server = config.servers[server_index]

	location = resolveToLocation(client.request_target, server.locations)

	# We now know which server and location directive the request belongs to,
	# so we have all the information we need!
	if client.request_method == GET:
		# TODO: Implement
	elif client.request_method == POST:
		# TODO: Implement
	elif client.request_method == DELETE:
		# TODO: Implement
```
