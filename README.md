# Socket Model
- - -
A small unix socket framework to support inter-process communications.

## Overview

Socket Model is a set of server/client reader/writer objects that provide a framework for inter-process communications based on unix sockets.

## Use

  // process A
  var SocketModel = require('socket-model');

  var server = SocketModel.createServer( { socketFile:'/tmp/test.sock' } );

  var writer = server.getWriter();
  var reader = server.getReader();
  reader.on('line', function(line) {
    writer.send('echo: ', line);
  });

  server.start();


  // process B
  var SocketModel = require('socket-model');
  var options = {
    socketFile:'/tmp/test.sock',
    log:require('simple-node-logger').createLogger(),
    reconnectOnError:true
  };

  var client = SocketModel.createClient( options );
  client.start();

  var writer = client.getWriter();
  var reader = client.getReader();

  reader.on('line', function(line) {
    console.log('line: ', line);
  });

  client.start();
  writer.write('hello socket model!');


## Examples

### Central LevelDb Hub

Create a hub for level db to support multiple application instances.

### Consolidated Application Logger

Combine log statements from multiple applications to write to a central location.

## API



- - -
_<small>Copyright (c) 2014, rain city software | Version 00.90.101, </small>_
