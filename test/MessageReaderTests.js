/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 8:21 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MessageReader = require('../lib/MessageReader');

describe('MessageReader', function() {
    'use strict';

    var log = require('simple-node-logger' ).createLogger();

    var createOptions = function() {
        var opts = {};

        opts.log = log;

        return opts;
    };

    describe('#instance', function() {
        var reader = new MessageReader( createOptions() ),
            methods = [
                'lineHandler',
                '__protected',
                // inherited
                'addListener',
                'emit',
                'listeners',
                'on',
                'once',
                'removeAllListeners',
                'removeListener',
                'setMaxListeners'
            ];

        it('should create an instance of MessageReader', function() {
            should.exist( reader );
            reader.should.be.instanceof( MessageReader );

            reader.__protected().separator.should.equal( '\n' );
        });

        it('should have all expected methods by size and type', function() {
            dash.methods( reader ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                reader[ method ].should.be.a( 'function' );
            });
        });
    });

});
