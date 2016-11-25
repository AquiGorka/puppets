"use strict";

var peer,
  broadcaster,
	listeners = [],
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

  // theater
  start: function({ onConnection, onClose, theaterId }) {
    if (theaterId) {
      return new Promise(function (resolve, reject) {
        //
        peer = new Peer(config.peerjs);
        connection = peer.connect(theaterId + '-broadcaster');
        peer.on('error', function(err) { console.warn(err); })
        //
        connection.on('open', function () {
          resolve(theaterId);
          onConnection();
        });
      });
    };

    return new Promise(function (resolve, reject) {
      var randomId = randomString(3);

      // broadcaster
      broadcaster = new Peer(randomId + '-broadcaster', config.peerjs);
      broadcaster.on('open', function (id) {
        //
        broadcaster.on('connection', function (conn) {
          // peer connected
          listeners.push(conn);
          // peer left
          conn.on('close', function () {
            listeners = listeners.filter(item => item !== conn);
          });
        });
      });

      // theater
      peer = new Peer(randomId, config.peerjs);
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
              onClose();
            });
            //
            onConnection();
          }
        });
        //
        resolve(id);
      });
    });
  },
	onData: function(callback) {
		if (connection) {
			connection.on('data', callback);
      connection.on('data', function(data) {
        listeners.forEach(item => item.send(data))
      });
		}
		return this;
	},

  // puppeteer
  connect: function(id) {
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
  send: function(data) {
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
