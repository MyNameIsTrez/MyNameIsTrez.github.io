---
layout: post
title: "How to process a request like nginx"
date: 2024-04-10 10:00:00 +0100
---

nginx its documentation of the [server directive](https://nginx.org/en/docs/http/ngx_http_core_module.html#server) explains that the `Host` HTTP header is used to decide which virtual server:

> Sets configuration for a virtual server. There is no clear separation between IP-based (based on the IP address) and name-based (based on the “Host” request header field) virtual servers. Instead, the listen directives describe all addresses and ports that should accept connections for the server, and the server_name directive lists all server names.
