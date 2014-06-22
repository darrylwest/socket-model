/**
 * @class SocketClient
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 7:28 PM
 */
var fs = require('fs' ),
    net = require('net'),
    dash = require('lodash' ),
    uuid = require('node-uuid' );

var SocketClient = function(options) {
    'use strict';

    var client = this,
        log = options.log,
        socketFile = options.socketFile,
        id = options.id || uuid.v4(),
        separator = options.separator || '\n',
        socket = null,
        writer = options.writer,
        reader = options.reader,
        connected = false,
        reconnect = options.reconnect;

    this.connectHandler = function() {
        log.info('client connected');
        connected = true;

        // if connect message, then send
        reader.setSocket( socket );
        reader.on( 'message', client.messageHandler );

        socket.on('error', client.errorHandler);
        socket.on('end', client.endHandler);
    };

    this.messageHandler = function(message) {
        log.info('message: ', message);
    };

    this.errorHandler = function(err) {
        log.error( err );
    };

    this.endHandler = function() {
        log.info('end');
    };

    this.start = function() {
        log.info('start the client socket for file: ', socketFile);

        // check the socket file; if it doesn't exist, then reconnect()

        socket = net.createConnection( socketFile, client.connectHandler );
    };

    this.__protected = function() {
        return {
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};

module.exports = SocketClient;