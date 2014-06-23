/**
 * @class SocketServer
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:01 PM
 */
var fs = require('fs' ),
    net = require('net' ),
    dash = require('lodash' ),
    uuid = require('node-uuid' ),
    carrier = require('carrier');

var SocketServer = function(options) {
    'use strict';

    var server = this,
        log = options.log,
        socketFile = options.socketFile,
        removeSocketFileOnStart = dash.isBoolean( options.removeSocketFileOnStart ) ? options.removeSocketFileOnStart : true,
        sendConnectMessage = dash.isBoolean( options.sendConnectMessage ) ? options.sendConnectMessage : false,
        id = options.id || uuid.v4(),
        separator = options.separator || '\n',
        writer = options.writer,
        reader = options.reader,
        carrier = require('carrier' ),
        socket,
        clients = [];

    /**
     * new connection handler
     *
     * @param connection - the client socket
     */
    this.createdCallback = function(connection) {
        var id = connection.id = connection._handle.fd;

        log.info('socket created for id: ', id);

        connection.on('error', function(err) {
            log.error( err );
            connection.end();
        });

        connection.on('end', function() {
            log.info('end the connection for id: ', id);
            connection.end();

            dash.remove( clients, { id:id } );
        });

        var lineReader = carrier.carry( connection, reader.lineHandler );

        clients.push( connection );

        if (sendConnectMessage) {
            var obj = {
                clients:dash.map( clients, 'id' ),
                yourid:connection.id
            };

            writer.send( obj, connection );
        }
    };

    /**
     * broadcast a message to all listening clients in the list
     *
     * @param obj - the string or object message
     * @param list - list of client sockets
     * @returns the wrapped message
     */
    this.broadcast = function(obj, list) {
        var wrapper = writer.wrapMessage( obj ),
            json = JSON.stringify( wrapper );

        if (!list) list = clients;

        list.forEach(function(client) {
            if (client.writable) {
                log.info('> broadcast: ', client.id, ': ', json);

                client.write( json );
                client.write( separator );
            }
        });

        return wrapper;
    };

    /**
     * add a listener to incoming client messages
     *
     * @param callback - message handler
     */
    this.onMessage = function(callback) {
        reader.on('message', callback);
    };

    /**
     * start the socket server; remove the socket file if necessary
     */
    this.start = function() {
        if (!socket) {
            log.info('start the server: ', socketFile);

            if (removeSocketFileOnStart) {
                removeSocketFile();
            }

            socket = net.createServer( server.createdCallback );
            socket.listen( socketFile, function() {
                log.info('socket listening to: ', socketFile);
            });
        }
    };

    this.stop = function() {
        if (socket) {
            log.info('kill the clients and stop the server');

            // TODO kill the reader, writer and clients

            socket.unref();
            socket.destroy();

            socket = null;
        }
    };

    /**
     * return a list of all client sockets
     */
    this.getClients = function() {
        return clients;
    };

    var removeSocketFile = function() {
        log.info('remove the socket file: ', socketFile);
        try {
            fs.unlinkSync( socketFile );
        } catch(e) { }
    };

    this.__protected = function() {
        return {
            reader:reader,
            writer:writer,
            socketFile:socketFile,
            removeSocketFileOnStart:removeSocketFileOnStart,
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!socketFile) throw new Error('socket server must be constructed with a socket file name');
    if (!reader) throw new Error('socket server must be constructed with a reader object');
    if (!writer) throw new Error('socket server must be constructed with a writer object');
};

module.exports = SocketServer;