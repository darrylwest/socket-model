/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 7:45 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    SocketModel = require('../lib/SocketModel' ),
    SocketClient = require('../lib/SocketClient');

describe('SocketClient', function() {
    'use strict';

    var log = require('simple-node-logger' ).createLogger();

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.socketFile = '/tmp/test.sock';

        return opts;
    };

    describe('#instance', function() {
        var client = new SocketClient( createOptions() ),
            methods = [
                'messageHandler',
                'connectHandler',
                'errorHandler',
                'endHandler',
                'sendGreeting',
                'start',
                '__protected'
            ];

        it('should create an instance of SocketClient', function() {
            should.exist( client );
            client.should.be.instanceof( SocketClient );

            client.__protected().separator.should.equal( '\n' );
            client.__protected().reconnect.should.equal( true );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( client ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                client[ method ].should.be.a( 'function' );
            });
        });
    });
});