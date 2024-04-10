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

If you look at this quote with this error we mentioned earlier in mind, when you let both virtual servers listen on the same address and on the same port:

> nginx: [warn] conflicting server name "" on 127.0.0.1:8080, ignored

The `conflicting server name ""` part hints that both virtual servers have the default name, namely an empty string.

So if we give the second virtual server a different `server_name`, we can get rid of the error:

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

Well, if we tell curl to be verbose with the `-v` flag, we get a lot of useful information, so we run `curl -v localhost:8080`:

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

The important takeaway here is that nginx can't always know which virtual server a request belongs to before the `Host` header has been read.

So if you're trying to mimic nginx in your own web server, I recommend reading the entire header and storing it as a map, before deciding which C++ Server class instance any incoming request belongs to.

# My C++ implementation

## Why getaddrinfo()

nginx accepts this config, where `curl localhost:8080` prints `a` and `curl localhost:8080 --header 'Host: foo'` prints `b`:

```nginx
server {
	listen localhost:8080;
	root /code;
	index public/a.html;
}

server {
	listen 127.0.0.1:8080;
	server_name foo;
	root /code;
	index public/b.html;
}
```

Mimicking this behavior requires `getaddrinfo()`. This is because even though the addresses `localhost` and `127.0.0.1` are different strings, they refer to the same address on your computer.

You could of course hardcode translating any occurrence of `localhost` to `127.0.0.1`, but `getaddrinfo()` its job is to translate it (and other aliases) for you!

So `getaddrinfo()` tells you that both virtual servers have identical `address:port` pairs, which allows you to only call `socket()` and `bind()` once.

If you were to call `bind()` for both of them, you'd get the error `Address already in use`, and there'd be no way for your program to know which virtual servers should and shouldn't share a socket.

### getaddrinfo() Python pseudocode

```py
# In Config.cpp

# Used to throw if a `server_name` is seen for a second time on the same `address:port`
names_of_bind_info = {}

for server_index, server in enumerate(servers):
	bind_infos_in_server = set()

	for listen in server.listens:
		# getaddrinfo() returns a linked list, but my C++ code is lazy
		# and just assumes the first node is the only one we need, which seemed to """work"""
		bind_info = getaddrinfo()

		# Raise an error if a server has both `listen localhost:8080;` and `listen 127.0.0.1:8080;`
		if bind_info in bind_infos_in_server:
			raise DuplicateBindInfoInServer

		bind_infos_in_server.add(bind_info)

		# The [] operator in C++ creates the vector for us if it doesn't exist yet
		self.bind_info_to_server_indices[bind_info].append(server_index)

		for server_name in server.server_names:
			# Raise an error if any server with the same bind_info already used this server_name
			if server_name in names_of_bind_info[bind_info]:
				Raise ConflictingServerNameOnListen

			names_of_bind_info[bind_info].add(server_name)
```

### socket() => bind() => listen() Python pseudocode

```py
# In Server.cpp

for bind_info, server_indices in config.bind_info_to_server_indices:
	bind_fd = socket()

	self.bind_fd_to_server_indices[bind_fd] = server_indices

	self.bind_fd_to_port[bind_fd] = bind_info.port

	bind(bind_fd, bind_info)

	listen(bind_fd)

	# Adds bind_fd to poll() its array of fds, lets us remember that this is a SERVER fd, and turns its POLLIN on
	self.add_fd(bind_fd, FdType::SERVER, POLLIN)
```
