#!/usr/bin/env node

'use strict';

var net = require('net'),
    carrier = require('carrier'),
    sock = '/tmp/test-server.sock',
    connected = false,
    clientId = Math.round(Math.random() * 1000000),
    restart,
    start;
    
start = function() {
    console.log('connect to: ', sock);

    var client = net.connect( sock ),
        stats = {
            messageCount:0
        };

    client.on('end', function() {
        connected = false;
        console.log('destroy the socket');
        client.destroy();
        console.log('restart...');
        restart();
    });

    client.on('error', function(err) {
        connected = false;
        console.log('client error: ', err.code);
    });

    client.on('connect', function() {
        connected = true;
        console.log( 'connected, create the client...' );

        client.write('client id: ' + clientId + '\n');

        var lineReader = carrier.carry( client );
        lineReader.on('line', function(data) {
            var obj = JSON.parse( data );
            console.log( obj );
            stats.messageCount += 1;
            
            if (stats.messageCount % 100 === 0) {
                if (false) {
                    console.log( stats );
                    console.log('closing, bytes read: ', client.bytesRead);

                    process.nextTick(function() {
                        client.pause();
                        client.end();
                        client.unref();

                        restart();
                    });
                }
            }
        });
    });
};

restart = function() {
    connected = false;
    try {
        var id = setInterval(function() {
            if (!connected) {
                start();
            } else {
                process.nextTick(function() {
                    clearInterval( id );
                });
            }
        }, 1000);
    } catch (e) {
        console.log( e );
    }
};

restart();
