//
var peer, connection;
var config = require('../../config.js');

$.getScript('http://burn-the-witch.local:8000/public/ios/peer.min.js', function() {
  $.getScript('http://burn-the-witch.local:8000/public/ios/gyro.js', function() {
    //
    $('#root').show();
    console.log('Waiting for id.');
    peer = new Peer(config.peerjs);

    $('#btn').click(function() {
      //
      var id = $('#peerid').val().toLowerCase();
      console.log('Trying to connect to: ', id);
      connection = peer.connect(id);
      //
      connection.on('open', function() {
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