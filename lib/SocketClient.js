/**
 * @class SocketClient
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 7:28 PM
 */
var fs = require('fs' ),
    net = require('net'),
    dash = require('lodash' ),
    uuid = require('node-uuid' ),
    carrier = require('carrier');

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
        reconnect = dash.isBoolean(options.reconnect ) ? options.reconnnect : true ;

    this.connectHandler = function() {
        log.info('client connected');
        connected = true;

        // if connect message, then send
        var lineReader = carrier.carry( socket, reader.lineHandler );

        reader.on( 'message', client.messageHandler );



        client.sendGreeting();
    };

    this.sendGreeting = function() {
        writer.send( 'greetings...', socket );
    };

    this.messageHandler = function(message) {
        log.info('< message: ', message);
    };

    this.errorHandler = function(err) {
        log.error( err );

    };

    this.endHandler = function() {
        log.info('client connection ended');

        reader.removeAllListeners();

        if (socket) {
            socket.removeAllListeners();
            socket.destroy();
            socket = null;
        }

        if (reconnect) {
            log.info('attempt a reconnect to ', socketFile);

            client.start();
        }
    };

    var connect = function() {
        if (fs.existsSync( socketFile )) {
            try {
                log.info('create socket connection to ', socketFile);

                socket = net.connect( socketFile, client.connectHandler );
                socket.on('connect', client.connectHandler );
                socket.on('error', client.errorHandler);
                socket.on('end', client.endHandler);
            } catch(err) {
                connected = false;
            }
        }
    };

    this.start = function() {
        log.info('start the client socket for file: ', socketFile);

        connected = false;

        // check the socket file; if it doesn't exist, then reconnect()
        connect();

        var id = setInterval(function() {
            if (connected) {
                clearInterval( id );
            } else {
                connect();
            }
        }, 5000);
    };

    this.__protected = function() {
        return {
            separator:separator,
            reconnect:reconnect
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};

module.exports = SocketClient;