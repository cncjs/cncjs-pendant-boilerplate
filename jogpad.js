const HID = require('node-hid');

// found with lsusb
const deviceID = [6700, 3620];

// jog speeds
const jogSpeeds = [100, 500, 1000];
var curSpeed = 1;

// jogStep in mm
const jogSteps = [0.1, 1, 10];
var curStep = 1;

// helpers
var jogging = false;
var ok = false;
function gcode(socket, options, code) { 
    console.log(code); 
    socket.emit('command', options.port, 'gcode', code); 
}
var jog;
function jogPool(socket, options)
{
    if (jog)
    {
        console.log(jog);
        gcode(socket, options, `$J=G91${jog.axis}${jog.dir * jogSteps[curStep]}F${jogSpeeds[curSpeed]}`); 
    }
}
function jogStart(socket, options, axis, dir) 
{ 
    jog = {axis:axis,dir:dir}; 
    jogPool(socket, options);
}
function jogEnd(socket, options) { 
    if (jog)
    {
        jog = undefined;
        gcode(socket, options, "\x85");
    }
 }
function park(socket, options) { gcode(socket, options, 'G91 G0 G53 Z-1'); gcode(socket, options, 'G53 X-1 Y-1'); }
function emit(socket, options, command) { console.log(command); socket.emit('command', options.port, command); }

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
const k_num000 = 39;
const k_dot = 99;

// my keyboard layout
const layout = [
    { keys: [k_slash], run: function (s,o) { emit(s,o, 'homing'); } },
    { keys: [k_num0, k_slash], run: park },
    { keys: [k_star], run: function (s,o) { emit(s,o, 'unlock'); } },
    { keys: [k_num0, k_star], run: function (s,o) { emit(s,o, 'reset'); } },
    { keys: [k_minus], run: function (s,o) { gcode(s,o, 'G28'); } },
    { keys: [k_num0, k_minus], run: function (s,o) { emit(s,o, 'G28.1'); } },
    { keys: [k_enter], run: function (s,o) { emit(s,o, 'stop'); } },
    { keys: [k_num0, k_enter], run: function (s,o) { emit(s,o, 'start'); } },
    { keys: [k_backspace], run: function (s,o) { emit(s,o, 'pause'); } },
    { keys: [k_num0, k_backspace], run: function (s,o) { emit(s,o, 'resume'); } },
    { keys: [k_plus], run: function (s) { emit(s,o, 'feedhold'); } },
    { keys: [k_num0, k_plus], run: function (s,o) { emit(s,o, 'cyclestart'); } },
    // jogStep
    { keys: [k_num4], run: function (s,o) { jogStart(s,o, 'X', -1); } },
    { keys: [k_num8], run: function (s,o) { jogStart(s,o, 'Y', 1); } },
    { keys: [k_num6], run: function (s,o) { jogStart(s,o, 'X', 1); } },
    { keys: [k_num2], run: function (s,o) { jogStart(s,o, 'Y', -1); } },
    { keys: [k_num9], run: function (s,o) { jogStart(s,o, 'Z', 1); } },
    { keys: [k_num3], run: function (s,o) { jogStart(s,o, 'Z', -1); } },

    { keys: [k_num7], run: function (s,o) { curStep = Math.min(jogSteps.length, curStep + 1); } },
    { keys: [k_num1], run: function (s,o) { curStep = Math.max(0, curStep - 1); } },

    { keys: [k_num0, k_num7], run: function (s,o) { curSpeed = Math.min(jogSpeeds.length, curSpeed + 1); } },
    { keys: [k_num0, k_num1], run: function (s,o) { curSpeed = Math.max(0, curSpeed - 1); } },

    { keys: [k_num5], run: function (s,o) { jogEnd(s,o); } },
    { keys: [], run: function (s,o) { jogEnd(s,o); } },
];

function parseKeys(buffer) {
    let k1 = buffer.readInt8(2);
    if (k1 == 0) return [];
    let k2 = buffer.readInt8(3);
    if (k2 == 0) return [k1];
    let k3 = buffer.readInt8(4);
    if (k3 == 0) return [k1, k2];
    return [k1, k2, k3];
}

function processKeys(keys, socket, options) {
    
    const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
    var action = layout.find(e => { return equals(e.keys, keys); });
    if (action && action.run) {
        console.log(keys,'->',action);
        action.run(socket, options);
    }
    else
    {
        console.warn(keys,'-> not mapped');
    }
}

function onSerial(data, socket, options)
{
    if (data.startsWith('ok'))
        jogPool(socket, options);
}

module.exports = function (socket,options) {
    try {

        socket.on('serialport:read', function (data) {
            onSerial(data, socket, options);
            //if (!joggingAck && data.startsWith('ok')) {
            //    joggingAck = true;
            //}
        });

        console.log(`opening device '${deviceID}'`);
        const device = new HID.HID(...deviceID);
        console.debug(device);


        device.on("data", function (data) {
            processKeys(parseKeys(data), socket ,options);
        });
    }
    catch (err) {
        console.error(err);
        console.log("Avaible devices:");
        console.log(HID.devices());
        throw (err);
    }
};