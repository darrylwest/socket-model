#!/usr/bin/env node

var log = require('simple-node-logger').createLogger(),
    SocketModel = require('../lib/SocketModel'),
    client,
    reader,
    opts = {
        socketFile:'/tmp/test-server.sock',
        log:log
    };

log.setLevel('debug');
client = SocketModel.createClient( opts );
reader = client.__protected().reader;

var interval = Math.round((Math.random() * 10) + 1) * 1000;
log.info('interval: ', interval);

client.onMessage(function(obj) {
    log.info(' <<< Server Message: ', obj.message);
    log.info('message count: ', reader.getMessageCount());
});

client.start();

id = setInterval(function() {
    var obj = {
        clientTime:new Date()
    };

    client.send( obj );
}, interval);

