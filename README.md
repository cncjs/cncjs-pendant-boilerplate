# cncjs-pendant-jogpad
cncjs-pendant-jogpad turn a generic cheap USB or bluetooth num pad into a fully customizable Grbl offline controller.

## Features
- Fully customizable (edit keyboad.js)
- Compatible with any num pad
- Comprensive configuration file
- Jogging or Step by Step move
- Can send gcode, cncjs command, macro, custom code...

## Configuration
There are no dead keys (shift, ctrl, ...) keys on numpad. But most of them support composing up to 3 of 4 keys allowing an infinity of combination and command.
I choose to use [dot] (green) and [0] (orange) as shifting key. 

Use numpadTest.js to test and configure your numpad.

## Prerequisite
- A raspberry pi 4. Any Linux computer should word.
- CncJs
- USB/BT/RF Num Pad

## Installation
```
npm install
```

## Usage
Run `bin/cncjs-pendant-jogpad` to start the interactive client. Pass --help to `cncjs-pendant-jogpad` for more options.

```
bin/cncjs-pendant-jogpad --help
```
