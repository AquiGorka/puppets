# Puppets
3D virtual puppet remote controlled via smartphone.

![Puppets Screenshot](https://raw.githubusercontent.com/AquiGorka/puppets/master/static/puppets.png)

## Video

- https://www.youtube.com/watch?v=u5ARH07qRWQ

## Links

- http://puppets.life
- http://demo.puppets.life
- http://slides.com/aquigorka/puppets
- http://aquigorka.net/project/puppets-life
- http://aquigorka.com/2015/11/presentacion-oficial-puppets-life


## Description
A puppet consisting of 10 body elements (head, torso, shoulders, arms, thighs and legs) and the proper joints (to connect the body elements and the control bar) gets rendered in the browser via WebGL (using ThreeJS).

To achieve realism it applies a physics engine (oimo.js). Every time the puppet gets rendered the physics thread calculates where each element is positioned as well as the element's orientation.

In order to remote control the puppet a WebRTC bridge is used (Peer.js helps the two clients find each other).

Once the connection is established the smartphone's gyroscope sends it's data over and the puppet's control bar mimics the smartphone's orientation.


## Dev
```sh
npm install
npm run server
npm run peerjs-server
npm run stutter-server
```

* Then open up a chrome browser in your computer to http://localhost:8000/public/theater/ it will show a QR code and a URL.
* Open the URL in a mobile device (right now it only works with Android).
* Once the synching gets done you will see a 3D virtual puppet rendered in the computer and it will respond accordingly to your smartphone's movements in real time.
* Using the Theater id you can open up more theaters to broadcast and render the puppet independently at different browsers or tabs (...public/theater/#/?t=theater_id_here ).
* Added a new section: control-bar. This sections renders the control bar as it mimics the smarthpone's orientation.


## iOS support
* Clone this repo: github.com/aquigorka/ios-webrtc
* Deploy an app to any device. The app should request the file at public/ios/index.js (this repo) and it will have full WebRTC support.
* Please set the correct hostname or ip address in the config.js file.

## Future Features
* Tests
* Linter

## Tech Stack
* JavaScript
* React
* node
* WebRTC
* WebGL
* ThreeJS
* oimo.js
* Peer.js

### License
MIT
