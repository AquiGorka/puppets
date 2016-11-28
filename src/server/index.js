"use strict";

var express = require('express');
var server = express();
var http = require('http').Server(server);

// socket server
http.listen(8000);
// http server
server.use(express.static(__dirname + '/../../'));
//
console.log('Server ON : *:8000');
//
return this;