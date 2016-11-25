# Puppets
3D virtual puppet remote controlled via smartphone.

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
* Using the Theater id you can open up more theaters to broadcast and render the puppet independently at different browsers or tabs.

## Future Features
* Tests
* Linter
* Publish iOS repo to use iPhones or iPads as remote controls - via a native extension WebRTC can be used in a hybrid app (meaning you will have the full WebRTC API available in JavaScript).

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
