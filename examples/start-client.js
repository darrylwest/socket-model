#!/usr/bin/env node

var client = require('../lib/SocketModel').createClient({ socketFile:'/tmp/test-server.sock' });

client.start();

