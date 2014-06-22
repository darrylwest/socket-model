#!/usr/bin/env node

var client = require('../lib/SocketModel').createClient({ socketFile:'/tmp/test-server.sock' });

var interval = Math.round((Math.random() * 10) + 1) * 1000;
console.log('interval: ', interval);

client.onMessage(function(obj) {
    console.log(' <<< Server Message: ', obj.message);
});

client.start();

id = setInterval(function() {
    var obj = {
        clientTime:new Date()
    };

    client.send( obj );
}, interval);

