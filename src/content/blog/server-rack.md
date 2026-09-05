---
title: "Custom SoHo Server Rack with Ubiquity Unifi"
description: "Upgrading a home network to a rack-mounted UniFi setup, plus the Raspberry Pi cluster living alongside it."
pubDate: 2020-07-01
category: "Networking Hardware"
tags: ["Ubiquity", "Unifi", "UDM Pro", "Switch", "Network"]
heroImage: "/images/blog/server-rack-full.jpg"
---
I've just updated my SoHo network set-up from:

- UniFi USG 3P
- UniFi USW-24-PoE 250 Switch
- UniFi Cloud Key G2 Plus
- 2x UniFi AC Pro Access Points
- 3x UniFi G3 Dome Cameras
- 1x UniFi G3 Flex Camera

to:

- [UniFi Dream Machine Pro](https://unifi-network.ui.com/dreammachine)
- [UniFi 24 Port PoE GEN2 Switch](https://unifi-network.ui.com/switching)
- [2x UniFi NanoHD Access Points](https://unifi-network.ui.com/wi-fi)
- [3x UniFi G3 Dome Cameras](https://unifi-network.ui.com/camera-security)
- [1x UniFi G3 Flex Camera](https://unifi-network.ui.com/camera-security)
- [1x UniFi G4 Bullet Camera](https://unifi-network.ui.com/camera-security)

![SoHo Server Rack](/images/blog/server-rack-kit.jpg)

It's using around 10W less power than the previous configuration and its quieter being passively cooled. I've added a solar powered extraction fan, and a separate powered temperature monitoring module that will activate two intake and one exhaust fan if needed.

I'm also running the following rack mounted equipment in there:

- Synology RS816 NAS Drive
- [BitScope Quattro Raspberry Pi blade](http://www.bitscope.com/product/BB04/)
- Cyberpower 600VA UPS with Remote Management Adapter

I'm running six Raspberry Pis, ranging from an original Model B hosting [FlightRadar24](https://www.flightradar24.com/), an [EmonPi](https://shop.openenergymonitor.com/emonpi/) power monitor on a Model 3B, and on the BitScope blade I have a model 4B, model 3B plus, model 3B and a model 2B all running [Docker](https://www.docker.com/) and various containers hosting some applications 24x7 along with being a test bed for testing some simple micro-services prototypes.

Below is a quick demonstration of the UniFi AR feature: [youtube.com/watch?v=0dlB-UAhTyw](https://www.youtube.com/watch?v=0dlB-UAhTyw)
