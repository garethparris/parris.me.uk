---
title: "Helping create an Interactive Wall for MIT"
description: "Designing and building the hardware and software behind an interactive wall for MIT's Campaign for a Better World."
pubDate: 2019-11-01
category: "Interactive Programming"
tags: [".NET", "C#", "IoT", "Arduino", "RFID"]
heroImage: "/images/blog/mit-wall-full.jpg"
thumbImage: "/images/blog/mit-wall.jpg"
---
In summer 2019, the MD of [Two Lines Meet](https://twolinesmeet.com/) contacted me and asked if I could assist them with the software and hardware design and development of an interactive wall for [MIT's Campaign for a Better World](https://betterworld.mit.edu/).

My brief was to gather all of the interaction data from various hardware devices on the wall, and then build and transmit commands to a projection mapping software package called [Resolume](https://resolume.com/).

The hardware specification (shown in the image below) included:

- 3x [Bare Conductive Capacitive Touch Boards](https://www.bareconductive.com/shop/touch-board/)
- 4x [Arduino Uno Boards](https://www.arduino.cc/en/Main/arduinoBoardUno/) with various sensors attached, i.e. 3x RFID readers, a Magnetometer, and a pull-cord on/off switch
- 2x USB [SpinTrak Precision Rotary controls](https://www.ultimarc.com/trackballs-and-spinners/spinners/) that produced a single dimensional mouse input
- 1x USB Microphone (for the clap sensor)
- 2x powered USB Hubs
- 1x Intel NUC PC
- 2x [Optoma Ultra Short Throw](https://www.optoma.co.uk/product-details/zw400ust) projectors

![Rear Wall](/images/blog/mit-wall-rear.jpg)

The software application itself was written as a C# WPF application using .NET Framework 4.8. Each wall section was written as a separate task, so they were all completely independent of each other. This was needed as multiple users could be interacting with different parts of the wall at any one time.

It interacted with both USB and USB/Serial hardware devices. There were several lower level pieces of code that needed to work well together, including the serial port handler and multiple mouse input devices. The latter required some Win32 calls to be able to select which mouse input device data was to be read from. Each task subscribed to the relevant input device handler in order to receive the appropriate events. That task then translated the data and sent instructions to Resolume in order to play the appropriate projection map.

Communication from the application to Resolume took the form of OSC packets. [OSC is a networking protocol](https://en.wikipedia.org/wiki/Open_Sound_Control) sent over UDP. A combination of open-source libraries and proprietary code was used to tweak this to our requirements.

A simple WPF GUI was created to indicate the current status of each task and also to allow some minor tweaks as the application was running, like adjusting the USB microphone sensitivity to cater for changes in background noise levels throughout the event.

![Rear Wall](/images/blog/mit-wall-app.jpg)

The first event was hosted at the [Queen Elizabeth II Conference Centre](https://qeiicentre.london/) in London, and we've since been out to Stamford, Connecticut with it. Unfortunately, due to COVID, the MIT Campaign for a Better World tour has been put on hold.

Here's a video of the wall in action at the London Event: [youtube.com/watch?v=Xov5VAHRwZk](https://youtube.com/watch?v=Xov5VAHRwZk)
