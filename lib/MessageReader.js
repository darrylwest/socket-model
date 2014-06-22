/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 8:18 PM
 */
var MessageReader = function(options) {
    'use strict';

    var reader = this,
        log = options.log,
        separator = options.separator || '\n';

    this.__protected = function() {
        return {
            separator:separator
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};

module.exports = MessageReader;