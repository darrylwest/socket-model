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
        id = options.id || uuid.v4(),
        separator = options.separator || '\n',
        writer = options.writer,
        reader = options.reader,
        carrier = require('carrier' ),
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

        var obj = {
            clients:dash.map( clients, 'id' ),
            yourid:connection.id
        };

        writer.send( obj, connection );
    };

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
            reader:reader,
            writer:writer,
            removeSocketFileOnStart:removeSocketFileOnStart,
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!socketFile) throw new Error('socket server must be constructed with a socket file name');
};

module.exports = SocketServer;