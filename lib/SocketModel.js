/**
 * @class SocketModel
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:08 PM
 */
'use strict';
var SocketServer = require('./SocketServer' ),
    MessageWriter = require('./MessageWriter' ),
    SocketModel = {},
    calcRandomFile;

calcRandomFile = function() {
    var n = Math.round((Math.random() * 1000000) + 10000000).toString(20);

    return '/tmp/socket-model-' + n + '.sock';
};

/**
 * create a socket server with the given options.  options must include a socket file name
 *
 * @param options - socket file, log, etc.
 * @returns SocketServer object
 */
SocketModel.createServer = function(options) {
    if (!options) {
        options = {};
    }

    if (typeof options !== 'object') {
        throw new Error('createServer must be called with an object...');
    }

    if (!options.log) {
        options.log = require('simple-node-logger' ).createLogger();
    }

    if (!options.socketFile) {
        options.socketFile = calcRandomFile();
        console.log('WARNING: socket server created with random file: ', options.socketFile);
    }

    if (!options.writer) {
        options.writer = new MessageWriter( options );
    }

    return new SocketServer( options );
};

module.exports = SocketModel;