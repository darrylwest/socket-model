# Socket Model
- - -
A small unix socket framework to support inter-process communications.

## Overview

Socket Model is a set of server/client reader/writer objects that provide a framework for inter-process communications based on unix sockets.  Communications exchange JSON messages delimited by CR (\n).  Messages can be read and written from either client or server using send() and read() where the message is either a string or a complex object.  Servers have the ability to broadcast messages to all active clients.  

Each message is wrapped in an object with the message id (mid), time stamp (ts) and the message.  Messages are parsed by the receiver (either client or server).  Message helpers include MessageWriter and MessageReader.  These classes may be swapped out or extended to provide additional capabilities.  They are injected to SocketServer and SocketClient when invoked through SocketModel's create methods.

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
