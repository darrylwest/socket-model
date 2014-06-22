#!/usr/bin/env node

var server = require('../lib/SocketModel').createServer({ socketFile:'/tmp/test-server.sock' });

server.start();

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

