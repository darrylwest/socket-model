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

    /**
     * the line handler parses the JSON line and fires a message event. Lines are delimied with the 'separator'
     * character, typically new line (\n).
     *
     * @param line - a stringified JSON object.
     */
    this.lineHandler = function(line) {
        if (line && line.length > 2) {
            var data = JSON.parse(line);

            messageCount++;

            log.info('< read: ', line, ', message count: ', messageCount);

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