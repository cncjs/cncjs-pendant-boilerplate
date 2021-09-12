'use strict'

function Jogger(socket, options) {
    this.socket = socket;
    this.options = options;
    this.jogFeeds = [100, 500, 1000];
    this.curFeed = 1;
    // jogStep in mm
    this.jogDistances = [0.1, 1, 10];
    this.curDist = 1;
    this.jog = undefined;
}
Jogger.prototype = {}


Jogger.prototype.changeDist = function (delta) {
    let curDist = this.curDist + delta;
    this.curDist = Math.max(0, Math.min(curDist, this.jogDistances.length - 1));
    console.debug('distance',this.jogDistances[this.curDist], 'mm');
}
Jogger.prototype.changeFeed = function (delta) {
    let curFeed = this.curFeed + delta;
    this.curFeed = Math.max(0, Math.min(curFeed, this.jogFeeds.length - 1));
    console.debug('feed',this.jogFeeds[this.curFeed],'mm/min');
}
Jogger.prototype.gcode = function (code) {
    console.log(code);
    this.socket.emit('command', this.options.port, 'gcode', code);
}
Jogger.prototype.jogPool = function () {
    if (this.jog) {
        console.log(this.jog);
        this.gcode(`$J=G91${this.jog.axis}${this.jog.dir * this.jogDistances[this.curDist]}F${this.jogFeeds[this.curFeed]}`);
    }
}
Jogger.prototype.jogStart = function (axis, dir) {
    this.jog = { axis: axis, dir: dir };
    this.jogPool();
}
Jogger.prototype.jogEnd = function () {
    if (this.jog) {
        this.jog = undefined;
        this.gcode("\x85");
    }
}
Jogger.prototype.jogOneStep = function (axis, dir) {
    this.gcode("G91");
    this.gcode(`G0 ${axis}${dir * this.jogDistances[this.curDist]}F${this.jogFeeds[this.curFeed]}`);
    this.gcode("G90");
}
//  Jogger.prototype. park() { 
//     this.gcode( 'G91 G0 G53 Z-1'); 
//  this.gcode('G53 X-1 Y-1'); 

// }
Jogger.prototype.emit = function (command) {
    console.log(command);
    this.socket.emit('command', this.options.port, command);
}
Jogger.prototype.runmacro = function (macro) {
    console.log(macro);
};



exports.Jogger = Jogger;