"use strict";

var React = require('react'),
	qmark = require('qmark'),
	NSA = require('../../../no-strings-attached/index.js'),
	styles = {
		wrapper: {
			overflow: 'hidden',
			backgroundColor: '#FFF',
			position: 'absolute',
			top: 0,
			bottom: 0,
			right: 0,
			left: 0,
			width: '100%',
			height: '100%',
			margin: 0,
			padding: 0
		},
		modal: {
			width: '100%%',
			height: '100%',
			boxSizing: 'border-box',
			margin: 'auto'
		},
		canvas: {
			height: '100%',
			zIndex: 1,
			position: 'relative'
		}
	},
	backgrounds = [
		{
			position: 'absolute',
			top: 0,
			right: 0,
			left: 0,
			width: '100%',
			margin: 0,
			padding: 0,
			zIndex: 0,
			height: 'auto'
		}
	];

var remoteDeviceData = {
		orientation: {
			alpha: 0,
			beta: 0,
			gamma: 0
		}
	};

var oimoInterval,
	obj,
	myReq,
	camera,
	scene,
	light,
	renderer,
	controls,
	world,
	bodys,
	meshs,
	lines,
	joints;

var oimoUtils = require('./oimo.utils.js');

var init = function (element) {
	// STAGE
	// camera
	camera = new THREE.PerspectiveCamera(30, element.offsetWidth/element.offsetHeight, 1, 10000);
	camera.position.z = 1000;
	camera.position.y = -150;
	// scene
	scene = new THREE.Scene();
	// lights
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 50, 10, 10 );
	scene.add( light );
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -50, 10, 10 );
	scene.add( light );
	// renderer
	renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true,
		alpha: true,
		antialias: false
	});
	renderer.setSize(element.offsetWidth, element.offsetHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0x000000, 0);

	// ELEMENTS + PHYSICS
	bodys = [];
	meshs = [];
	lines = [];
	joints = [];
	//
	oimoUtils.init(scene);
	world = new OIMO.World();
	// control bar
	obj = { size: [100, 2, 200], pos: [0, 200, 0], world: world, name: 'control-bar', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	
	// CONTROLS
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );

	// DOM
	element.appendChild( renderer.domElement );
};

var animate = function () {
	myReq = window.requestAnimationFrame(animate);
	controls.update();
	render();
};

var render = function () {
	renderer.render(scene, camera);
};

var oimoLoop = function () {
	if (world) {
		world.step();// update world
	}

	var alpha = ((remoteDeviceData.orientation.alpha !== null) ? remoteDeviceData.orientation.alpha : 0),
		beta = ((remoteDeviceData.orientation.beta !== null) ? remoteDeviceData.orientation.beta : 0),
		gamma = ((remoteDeviceData.orientation.gamma !== null) ? remoteDeviceData.orientation.gamma : 0),
		degreesToRadians = Math.PI / 180,
		newRotation;

	//console.log(alpha, beta, gamma, remoteDeviceData);
	//
	newRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(beta * degreesToRadians, alpha * degreesToRadians, -gamma * degreesToRadians, "XYZ"));
	if (meshs[0] && bodys[0]) {
		meshs[0].quaternion.copy(newRotation);
		bodys[0].setQuaternion(meshs[0].quaternion);
		// control bar back to top
		bodys[0].setPosition(meshs[0].position);
	}

	// puppet
	meshs.forEach(function (mesh, index) {
		meshs[index].position.copy(bodys[index].getPosition());
		meshs[index].quaternion.copy(bodys[index].getQuaternion());
	});

	// joints
	joints.forEach(function (joint, index) {
		var pos = joint.getPosition();
		lines[index].geometry.vertices[0].copy( pos[0] );
		lines[index].geometry.vertices[1].copy( pos[1] );
		lines[index].geometry.verticesNeedUpdate = true;
	});
};

var Simulation = React.createClass({
	displayName: 'Simulation',
	//
	componentDidMount: function () {
		NSA.onData(function (data) {
			remoteDeviceData = data;
		});
		//
		init(React.findDOMNode(this.refs.canvas));
		oimoInterval = setInterval(oimoLoop, 1000/60);
		animate();
		render();
	},
	componentWillUnmount: function () {
		clearInterval(oimoInterval);
		if (myReq) {
			window.cancelAnimationFrame(myReq);
		};
	},
	getInitialState: function () {
		return {
			bgIndex: 0,
			refresh: 0
		};
	},
	//
	render: function () {
		return (
			<div style={styles.wrapper}>
				<div style={backgrounds[this.state.bgIndex]}></div>
				<div style={styles.modal}>
					<div ref="canvas" style={styles.canvas}></div>
				</div>
			</div>
		);
	}
});

module.exports = Simulation;
