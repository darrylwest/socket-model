#!/usr/bin/env node

var server = require('../lib/SocketModel').createServer({ socketFile:'/tmp/test-server.sock' });

server.start();

server.onMessage(function(msg) {
    console.log(' <<< Client Message: ', JSON.stringify( msg ));
    server.broadcast( msg.message );
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

