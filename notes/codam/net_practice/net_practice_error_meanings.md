net_practice error meanings

# packet not for me
This means that two interfaces connected to a router have the same network-address, according to at least *one* of those interface masks.

# error on destination ip - multiple interface match
This means that there are two interfaces with identical IPs.

# on interface X: invalid IP address
This means that the custom IP bits are either all 0s or 1s.

# on X: destination does not match any route
This means that for every single routing table’s route, not a single route ANDed with its CIDR results in the same network address bits as the destination ANDed with the route’s CIDR.

# on X: invalid gate IP
This means the routing table’s next hop is an IP that doesn’t exist.

# duplicate IP (X)
This means that a next hop was set to one of the interface IPs that are directly attached to this same device.

# invalid default route on internet I
This means you either set the internet’s route to “default” or “0.0.0.0/0”. You *can* use “0.0.0.1/0” however.
