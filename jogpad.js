'use strict'
const HID = require('node-hid');
const Jogger = require('./jogger.js');
const keyboard = require('./keyboard.js');


function parseKeys(buffer) {
    let k1 = buffer.readInt8(2);
    if (k1 == 0) return [];
    let k2 = buffer.readInt8(3);
    if (k2 == 0) return [k1];
    let k3 = buffer.readInt8(4);
    if (k3 == 0) return [k1, k2];
    return [k1, k2, k3];
}

function processKeys(keys,jogger) {

    const equals = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
    var action = keyboard.layout.find(e => { return equals(e.keys, keys); });
    if (action && action.run) {
        console.log(keys, '->', action);
        action.run(jogger);
    }
    else {
        console.warn(keys, '-> not mapped');
    }
}

function onSerial(data, jogger) {
    console.log(data);
    if (data.startsWith('ok'))
        jogger.jogPool();
}

module.exports = function (socket, options) {
    try {
        let jogger = new Jogger.Jogger(socket, options);

        socket.on('serialport:read', function (data) {
            onSerial(data, jogger);
        });

        console.log(`opening device '${keyboard.deviceID}'`);
        const device = new HID.HID(...keyboard.deviceID);
        console.debug(device);

        device.on("data", function (data) {
            processKeys(parseKeys(data), jogger);
        });
    }
    catch (err) {
        console.error(err);
        console.log("Avaible devices:");
        console.log(HID.devices());
        throw (err);
    }
};