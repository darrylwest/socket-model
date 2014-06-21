/**
 * @class SocketModel
 *
 * @author: darryl.west@roundpeg.com
 * @created: 6/21/14 2:08 PM
 */
'use strict';
var SocketServer = require('./SocketServer');

var SocketModel = {};

SocketModel.createServer = function(options) {

    // check for log and socket filename
    return new SocketServer( options );
};

module.exports = SocketModel;