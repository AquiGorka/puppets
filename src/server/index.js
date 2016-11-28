"use strict";

var express = require('express');
var server = express();
var http = require('http').Server(server);
var PORT = 8000;

// socket server
http.listen(PORT);
// http server
server.use(express.static(__dirname + '/../../'));
//
console.log('Server ON : *:' + PORT);
//
return this;