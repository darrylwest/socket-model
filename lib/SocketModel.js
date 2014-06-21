/**
 * @class SocketModel
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:08 PM
 */
'use strict';
var dash = require('lodash' ),
    SocketServer = require('./SocketServer' ),
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
    // check for log and socket filename
    if (!options) {
        options = {};
    }

    if (!options.log) {
        options.log = require('simple-node-logger' ).createLogger();
    }

    if (!options.socketFile) {
        options.socketFile = calcRandomFile();
        options.log.warn('socket server created with random file: ', options.socketFile);
    }

    return new SocketServer( options );
};

module.exports = SocketModel;