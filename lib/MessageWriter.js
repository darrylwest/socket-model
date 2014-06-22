/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 6:37 PM
 */
var uuid = require('node-uuid');

var MessageWriter = function(options) {
    'use strict';

    var writer = this,
        log = options.log,
        separator = options.separator || '\n';

    this.wrapMessage = function(obj) {
        var wrapper = {
            mid:uuid.v4(),
            ts:Date.now(),
            message:obj
        };

        return wrapper;
    };

    this.send = function(obj, socket) {
        var wrapper;

        if (socket && socket.writable) {
            log.info('send a message to client id: ', socket.id);
            wrapper = writer.wrapMessage( obj );
            socket.write( JSON.stringify( obj ) + separator );
        } else {
            log.warn('client socket is no longer writable: ', socket.id);
        }

        return wrapper;
    };

    this.__protected = function() {
        return {
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};


module.exports = MessageWriter;