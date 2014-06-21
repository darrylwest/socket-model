/**
 * @class SocketServerTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:03 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    SocketModel = require('../lib/SocketModel' ),
    SocketServer = require('../lib/SocketServer');

describe('SocketServer', function() {
    'use strict';

    var log = require('simple-node-logger' ).createLogger();

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.socketFile = '/tmp/test.sock';
        opts.removeFileOnStart = true;

        return opts;
    };

    describe('#instance', function() {
        var server = new SocketServer( createOptions() ),
            methods = [
                'getSocketFile'
            ];

        it('should create an instance of SocketServer', function() {
            should.exist( server );
            server.should.be.instanceof( SocketServer );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( server ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                server[ method ].should.be.a( 'function' );
            });
        });
    });
});
