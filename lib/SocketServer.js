/**
 * @class SocketServer
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:01 PM
 */
var SocketServer = function(options) {
    'use strict';

    var server = this,
        log = options.log,
        socketFile = options.socketFile;

    this.getSocketFile = function() {
        return socketFile;
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!socketFile) throw new Error('socket server must be constructed with a socket file name');
};

module.exports = SocketServer;