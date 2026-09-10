---
title: "kitty-pounce: A Flat-Ring Window Cycler for Kitty"
description: "Why I built kitty-pounce, a kitty terminal extension that cycles every window, tab and OS window as one flat ring."
pubDate: 2026-09-10
category: "Open Source"
tags: ["Open Source", "Kitty", "Terminal", "Claude Code"]
heroImage: "/images/blog/kitty-pounce-full.jpg"
thumbImage: "/images/blog/kitty-pounce.jpg"
---
This morning I built [kitty-pounce](https://github.com/garethparris/kitty-pounce), a small
[kitty terminal](https://sw.kovidgoyal.net/kitty/) extension that cycles through every window,
in every tab, in every OS window, as one flat ring: one keypress moves forward or backward,
wrapping from the last one back to the first.

I run a lot of Claude Code agents at once, each in its own kitty window or tab, and finding the
right one again was getting harder as the count grew. The immediate trigger was hardware: my
Jiffy 75 keyboard has two rotary knobs, and the right one is already spoken for, volume and
mute, but the left one had nothing bound to it.

## Kitty already had three shortcuts, none of them the right one

Kitty's built-in `next_window`/`previous_window` only cycle the windows in the current tab, and
`next_tab`/`previous_tab` only cycle the tabs in the current OS window. With several tabs and OS
windows open, there's no single keystroke that walks every window everywhere: switching to the
right agent meant switching OS window, then tab, then window, three separate actions for what
felt like one motion.

Kitty's own `select_tab` picker actually lists tabs from every OS window, which looked
promising, but it silently fails to switch to most of them. It hands the list to
[`Boss.set_active_tab`](https://github.com/kovidgoyal/kitty/blob/v0.48.2/kitty/boss.py#L2782-L2786),
which only knows how to activate a tab inside the OS window that's currently focused. Not a bug
worth reporting so much as a gap kitty-pounce exists to fill, one level deeper.

## A flat ring was the obvious fit for a knob

Turn it one way or the other and step through every window, tab and OS window as a single
continuous list, wrapping round at either end. That turned out to be a genuinely faster way to
find a specific agent than hunting through three separate shortcuts. kitty-pounce doesn't bind
the knob itself: it only reads the direction, `next` or `prev`, passed on the `map` line in
`kitty.conf`, so it works with whatever key or device someone wants to wire it up to.

It's a Python kitten, developed and verified against kitty 0.48.2. No lower bound is claimed yet
beyond that: kitty's own docs describe its internal APIs as "neither entirely stable nor
documented", so I'd rather state a floor once CI has actually tested more than one release than
guess at one now.

## What doesn't work yet

Three honest limitations, straight from the README rather than glossed over:

- `tab_bar_filter` is ignored. If a tab is hidden from the tab bar, kitty-pounce still visits
  its windows: it enumerates every tab kitty knows about, not just the visible ones.
- A stacked or grouped set of windows sharing one on-screen position counts as a single stop,
  landing on whichever one was last active there, the same as kitty's own built-in cycling.
- Crossing OS windows on different macOS Spaces triggers a real Space-switch animation. Kitty
  exposes no API for a kitten to know which Space an OS window lives on, so there's no way to
  avoid it: one keypress can trigger a full macOS Space switch if the next window happens to be
  on another one.

None of those are deal-breakers for what it's actually for, finding the next agent fast, but
they're worth knowing before wiring it up to something you'll be pressing a hundred times a day.

It's on GitHub, MIT licensed, if the same problem sounds familiar:
[github.com/garethparris/kitty-pounce](https://github.com/garethparris/kitty-pounce)
