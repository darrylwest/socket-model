#!/usr/bin/env node

var log = require('simple-node-logger').createLogger(),
    SocketModel = require('../lib/SocketModel'),
    server,
    opts = {
        socketFile:'/tmp/test-server.sock',
        log:log
    };
    
log.setLevel('debug');
server = SocketModel.createServer( opts );

server.start();

server.onMessage(function(msg) {
    log.info(' <<< Client Message: ', JSON.stringify( msg ));
    server.broadcast( msg.message );
});

server.onClientConnection(function(socket) {
    log.info('new client connection: ', socket.id);
});

var count = 0;
var id = setInterval(function() {
    if (server.getClients().length > 0) {
        var obj = {
            time:new Date(),
            count:count++
        };

        server.broadcast( obj );
    }
}, 6000);

