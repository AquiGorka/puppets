var stutter = require('stutter').Stun;
var Stun = new stutter({port:1234,
                        debug:true,
                        authentication:'none'});
Stun.createServer();

// HACK
var Parser = require('../../node_modules/stutter/lib/parser');

Parser.decodeHeader = function(packet){
    var zeros = packet.slice(0, 1)
      , message_type = packet.slice(0, 2)
      , message_length = packet.slice(2, 4)
      , magic_cookie = packet.slice(4, 8)
      , transaction_id = packet.slice(8, 20);

    return {
          'zeros':zeros,
          'message_type':message_type,
          'message_length':message_length,
          'magic_cookie':magic_cookie,
          'transaction_id':transaction_id,
          'error':null
      }
}
