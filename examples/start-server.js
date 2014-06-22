#!/usr/bin/env node

var server = require('../lib/SocketModel').createServer({ socketFile:'/tmp/test-server.sock' });

server.start();

