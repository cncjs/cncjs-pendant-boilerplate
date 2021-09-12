'use strict'

// found with lsusb
exports.deviceID = [6700, 3620];

// hardware key
const k_num_lock = 83;
const k_slash = 84;
const k_star = 85;
const k_minus = 86;

const k_num7 = 95;
const k_num8 = 96;
const k_num9 = 97;
const k_plus = 87;

const k_num4 = 92;
const k_num5 = 93;
const k_num6 = 94;
const k_backspace = 42;

const k_num1 = 89;
const k_num2 = 90;
const k_num3 = 91;
const k_enter = 88;

const k_num0 = 98;
const k_num000 = -1; // send '39' 3 times. but  send -1 when composed
const k_dot = 99;

// my keyboard layout
exports.layout = [
    { keys: [k_slash], run: function (j) { j.emit('homing'); } },
    {
        keys: [k_num0, k_slash], 
        run: function (f) {
            f.gcode('G91 G0 G53 Z-1');
            f.gcode('G53 X-1 Y-1');
        }
    },
    { keys: [k_dot, k_slash], run: function (j) { j.runmacro("JogPadMacro1"); } },

    { keys: [k_star], run: function (j) { j.emit('unlock'); } },
    { keys: [k_num0, k_star], run: function (j) { j.emit('reset'); } },
    { keys: [k_dot, k_star], run: function (j) { j.runmacro("JogPadMacro2"); } },

    { keys: [k_minus], run: function (j) { j.gcode('G28'); } },
    { keys: [k_num0, k_minus], run: function (j) { j.emit('G28.1'); } },
    { keys: [k_dot, k_minus], run: function (j) { j.runmacro("JogPadProbe"); } },

    { keys: [k_plus], run: function (j) { j.emit('feedhold'); } },
    { keys: [k_dot, k_plus], run: function (j) { j.emit('cyclestart'); } },

    { keys: [k_backspace], run: function (j) { j.emit('pause'); } },
    { keys: [k_dot, k_backspace], run: function (j) { j.emit('resume'); } },

    { keys: [k_enter], run: function (j) { j.emit('stop'); } },
    { keys: [k_dot, k_enter], run: function (j) { j.emit('start'); } },

    { keys: [k_num0,k_num000], run: function (j) { j.gcode('M5'); } },
    { keys: [k_dot, k_num000], run: function (j) { j.gcode('M3S1000'); } },

    // arrows
    // X-
    { keys: [k_num4], run: function (j) { j.jogOneStep('X', -1); } },
    { keys: [k_num0, k_num4], run: function (j) { j.jogStart('X', -1); } },
    { keys: [k_dot, k_num4], run: function (j) { j.gcode('G10 L20 P1 X0 Y0', -1); } },
    // 

    // Y+
    { keys: [k_num8], run: function (j) { j.jogOneStep('Y', 1); } },
    { keys: [k_num0, k_num8], run: function (j) { j.jogStart('Y', 1); } },

    // X+
    { keys: [k_num6], run: function (j) { j.jogOneStep('X', 1); } },
    { keys: [k_num0, k_num6], run: function (j) { j.jogStart('X', 1); } },
    { keys: [k_dot, k_num6], run: function (j) { j.gcode('G0 X0 Y0'); } },

    // Y-
    { keys: [k_num2], run: function (j) { j.jogOneStep('Y', -1); } },
    { keys: [k_num0, k_num2], run: function (j) { j.jogStart('Y', -1); } },
    
    // Z+
    { keys: [k_num9], run: function (j) { j.jogOneStep('Z', 1); } },
    { keys: [k_num0, k_num9], run: function (j) { j.jogStart('Z', 1); } },
    { keys: [k_dot, k_num9], run: function (j) { j.gcode('G0 Z0'); } },

    // Z-
    { keys: [k_num3], run: function (j) { j.jogOneStep('Z', -1); } },
    { keys: [k_num0, k_num3], run: function (j) { j.jogStart('Z', -1); } },
    { keys: [k_dot, k_num3], run: function (j) { j.gcode('G10 L20 P1 Z0'); } },

    // center
    { keys: [k_num5], run: function (j) { j.jogEnd(j); } },
    { keys: [k_dot, k_num5], run: function (j) { j.gcode('G0 X0 Y0 Z0'); } },
    { keys: [k_num0, k_num5], run: function (j) { j.gcode('G10 L20 P1 X0 Y0 Z0'); } },

    // control speed and step distance
    { keys: [k_num7], run: function (j) { j.changeDist(1); }},// curStep = Math.min(jogSteps.length, curStep + 1); } },
    { keys: [k_num1], run: function (j) { j.changeDist(-1); }},//curStep = Math.max(0, curStep - 1); } },

    { keys: [k_num0, k_num7], run: function (j) { j.changeFeed(1); }},//curSpeed = Math.min(jogSpeeds.length, curSpeed + 1); } },
    { keys: [k_num0, k_num1], run: function (j) { j.changeFeed(-1); }},//curSpeed = Math.max(0, curSpeed - 1); } },

    // jogging end
    { keys: [], run: function (j) { j.jogEnd(); } }, // all keys up
    { keys: [k_num0], run: function (j) { j.jogEnd(); } }, // all keys up
    { keys: [k_dot], run: function (j) { j.jogEnd(); } }, // all keys up
];

 