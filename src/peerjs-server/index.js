var config = require('../../config.js');
var PeerServer = require('peer').PeerServer;
var server = PeerServer({ port: config.peerjs.port, path: config.peerjs.path });
