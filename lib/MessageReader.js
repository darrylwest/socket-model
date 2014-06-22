/**
 * @class MessageReader
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 8:18 PM
 */
var events = require('events' ),
    util = require('util' );

var MessageReader = function(options) {
    'use strict';

    var reader = this,
        log = options.log,
        separator = options.separator || '\n',
        messageCount = 0;

    events.EventEmitter.call( this );

    this.lineHandler = function(line) {
        if (line && line.length > 2) {
            var data = JSON.parse(line);

            messageCount++;

            log.info('< read: ', messageCount, ', data: ', data);

            reader.emit( 'message', data );
        }
    };

    this.__protected = function() {
        return {
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};

util.inherits( MessageReader, events.EventEmitter );

module.exports = MessageReader;