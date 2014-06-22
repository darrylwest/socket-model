/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 6:53 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MessageWriter = require('../lib/MessageWriter');

describe('MessageWriter', function() {
    'use strict';

    var log = require('simple-node-logger' ).createLogger();

    var createOptions = function() {
        var opts = {};

        opts.log = log;

        return opts;
    };

    describe('#instance', function() {
        var writer = new MessageWriter( createOptions() ),
            methods = [
                'wrapMessage',
                'send',
                '__protected'
            ];

        it('should create an instance of MessageWriter', function() {
            should.exist( writer );
            writer.should.be.instanceof( MessageWriter );

            writer.__protected().separator.should.equal( '\n' );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( writer ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                writer[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('wrapMessage', function() {
        it('should wrap a plain text message');
        it('should wrap a complex object');
        it('should reject a null message');
    });
});
