/**
 * @class SocketModel
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:08 PM
 */
'use strict';
const SocketServer = require('./SocketServer' ),
    SocketClient = require('./SocketClient' ),
    MessageWriter = require('./MessageWriter' ),
    MessageReader = require('./MessageReader' ),
    SocketModel = {};

function calcRandomFile() {
    const n = Math.round((Math.random() * 1000000) + 10000000).toString(20);

    return '/tmp/socket-model-' + n + '.sock';
}

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
        options.log = require('simple-node-logger' ).createSimpleLogger();
    }

    if (!options.socketFile) {
        options.socketFile = calcRandomFile();
        console.log('WARNING: socket server created with random file: ', options.socketFile);
    }

    if (!options.writer) {
        options.writer = new MessageWriter( options );
    }

    if (!options.reader) {
        options.reader = new MessageReader( options );
    }

    return new SocketServer( options );
};

SocketModel.createClient = function(options) {
    if (!options || typeof options !== 'object' || !options.socketFile) {
        throw new Error('createClient must be called with an object that defines socketFile...');
    }

    if (!options.log) {
        options.log = require('simple-node-logger' ).createSimpleLogger();
    }

    if (!options.writer) {
        options.writer = new MessageWriter( options );
    }

    if (!options.reader) {
        options.reader = new MessageReader( options );
    }

    return new SocketClient( options );
};

module.exports = SocketModel;
