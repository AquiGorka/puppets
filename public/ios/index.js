(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
    theater: {
        host: 'http://burn-the-witch.local:8000/public/puppeteer/#/'
    },
    peerjs: {
        key: 'peerjs',
        host: 'burn-the-witch.local',
        port: 9000,
        path: '/puppets',
        config: { 'iceServers': [{ 'url': 'stun:burn-the-witch.local:1234' }] }
    }
};


},{}],2:[function(require,module,exports){
//
'use strict';

var peer, connection;
var config = require('../../config.js');

$.getScript('http://burn-the-witch.local:8000/public/ios/peer.min.js', function () {
  $.getScript('http://burn-the-witch.local:8000/public/ios/gyro.js', function () {
    //
    $('#root').show();
    console.log('Waiting for id.');
    peer = new Peer(config.peerjs);

    $('#btn').click(function () {
      //
      var id = $('#peerid').val().toLowerCase();
      console.log('Trying to connect to: ', id);
      connection = peer.connect(id);
      //
      connection.on('open', function () {
        console.log('Connected.');
        alert('Connected!');
        $('#root').hide();
        //
        gyro.frequency = 50;
        gyro.startTracking(function (o) {
          connection.send({
            orientation: {
              alpha: o.alpha,
              beta: o.beta,
              gamma: o.gamma
            }
          });
        });
      });
    });
  });
});


},{"../../config.js":1}]},{},[2]);
