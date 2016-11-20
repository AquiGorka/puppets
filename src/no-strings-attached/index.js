"use strict";

var peer,
	connection,
  config = require('../../config.js');

var randomString = function(length) {
    var mask = '';
    mask += 'abcdefghijkmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
}

var NSA = {
	start: function (onConn, onDisconn) {
		return new Promise(function (resolve, reject) {
			peer = new Peer(randomString(3), config.peerjs);
			//
			peer.on('open', function (id) {
				//
				peer.on('connection', function (conn) {
					// peer connected
					if (!connection) {
						connection = conn;
						//
						connection.on('close', function () {
							// peer left
							connection = null;
							//
							onDisconn();
						});
						//
						onConn();
					}
				});
				//
				resolve(id);
			});
		});
	},
	onData: function (callback) {
		if (connection) {
			connection.on('data', callback);
		}
		return this;
	},

  //
  connect: function (id) {
    if (id) {
      return new Promise(function (resolve, reject) {
        //
        peer = new Peer(config.peerjs);
        connection = peer.connect(id);

        peer.on('error', function(err) { console.warn(err); })
        //
        connection.on('open', function () {
          resolve();
        });
      });
    } else {
      return Promise.reject('Puppet connect error: Please provide an id.');
    }
  },
  send: function (data) {
    if (connection) {
      connection.send(data);
    }
    return this;
  },
  destroy: function () {
    if (peer) {
      peer.destroy();
    }
    return this;
  }
};

module.exports = NSA;
