/**
 * @class SocketServer
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:01 PM
 */
var fs = require('fs' ),
    net = require('net' ),
    dash = require('lodash' ),
    uuid = require('node-uuid');

var SocketServer = function(options) {
    'use strict';

    var server = this,
        log = options.log,
        socketFile = options.socketFile,
        removeSocketFileOnStart = dash.isBoolean( options.removeSocketFileOnStart ) ? options.removeSocketFileOnStart : true,
        id = options.id || uuid.v4(),
        separator = options.separator || '\n',
        writer = options.writer,
        reader = options.reader,
        socket,
        clients = [];

    this.getSocketFile = function() {
        return socketFile;
    };

    var removeSocketFile = function() {
        log.info('remove the socket file: ', socketFile);
        try {
            fs.unlinkSync( socketFile );
        } catch(e) { }
    };

    this.createdCallback = function(connection) {
        var id = connection._handle.fd;

        connection.id = id;

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

        clients.push( connection );

        // should fire a new client event
    };

    this.broadcast = function(obj, list) {
        var wrapper = writer.wrapMessage( obj ),
            json = JSON.stringify( wrapper ) + separator;

        if (!list) list = clients;

        list.forEach(function(client) {
            if (client.writable) {
                log.info('send message to id: ', client.id);

                client.write( json );
            }
        });

        return wrapper;
    };

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

    this.getClients = function() {
        return clients;
    };

    this.__protected = function() {
        return {
            removeSocketFileOnStart:removeSocketFileOnStart,
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!socketFile) throw new Error('socket server must be constructed with a socket file name');
};

module.exports = SocketServer;