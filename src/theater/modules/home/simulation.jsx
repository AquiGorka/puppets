"use strict";

var React = require('react'),
	qmark = require('qmark'),
	NSA = require('../../../no-strings-attached/index.js'),
	styles = {
		wrapper: {
			overflow: 'hidden',
			backgroundColor: '#000',
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
			backgroundImage: 'url(./img/background-stage.png)',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 600,
			backgroundPosition: 'bottom center',
			bottom: 110,
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
	camera = new THREE.PerspectiveCamera(80, element.offsetWidth/element.offsetHeight, 1, 10000);
	camera.position.z = 500;
	camera.position.y = -30;
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
	// head
	obj = { size: [20, 20, 10], pos: [0, 0, 0], world: world, name: 'head', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// torso
	obj = { size: [40, 80, 2], pos: [0, -60, 0], world: world, name: 'torso', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// right forearm
	obj = { size: [30, 10, 2], pos: [-50, -30, 0], world: world, name: 'right-forearm', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// right arm
	obj = { size: [30, 10, 2], pos: [-90, -30, 0], world: world, name: 'right-arm', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// left forearm
	obj = { size: [30, 10, 2], pos: [50, -30, 0], world: world, name: 'left-forearm', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// left arm
	obj = { size: [30, 10, 2], pos: [90, -30, 0], world: world, name: 'left-arm', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// right thigh
	obj = { size: [10, 40, 2], pos: [-10, -130, 0], world: world, name: 'right-thigh', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// right leg
	obj = { size: [10, 40, 2], pos: [-10, -180, 0], world: world, name: 'right-leg', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// left thigh
	obj = { size: [10, 40, 2], pos: [10, -130, 0], world: world, name: 'left-thigh', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));
	// left leg
	obj = { size: [10, 40, 2], pos: [10, -180, 0], world: world, name: 'left-leg', move: true };
	bodys.push(new OIMO.Body(obj));
	meshs.push(oimoUtils.add(obj));

	// joints
	// control-bar-head
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'control-bar',
		body2: 'head',
		pos1: [20, 0, 0],
		pos2: [0, 10, 0],
		collision: true,
		min: 180,
		max: 220,
		spring: [10, 1],
		name: 'control-bar-head'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// head-torso-1
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'head',
		body2: 'torso',
		pos1: [-3, -10, 0],
		pos2: [-3, 40, 0],
		collision: true,
		min: 2,
		max: 3,
		spring: [8, 0.2],
		name: 'head-torso-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// head-torso-2
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'head',
		body2: 'torso',
		pos1: [3, -10, 0],
		pos2: [3, 40, 0],
		collision: true,
		min: 2,
		max: 3,
		spring: [8, 0.2],
		name: 'head-torso-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-right-arm-1
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'right-forearm',
		pos1: [-22, 29, 0],
		pos2: [17, -1, 0],
		collision: true,
		name: 'torso-right-arm-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-right-arm-2
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'right-forearm',
		pos1: [-22, 31, 0],
		pos2: [17, 1, 0],
		collision: true,
		name: 'torso-right-arm-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// right-forearm-right-arm
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'right-forearm',
		body2: 'right-arm',
		pos1: [-15, 0, 0],
		pos2: [-15, 0, 0],
		collision: true,
		name: 'right-forearm-right-arm'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// control-bar-right-arm
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'control-bar',
		body2: 'right-arm',
		pos1: [0, 0, -90],
		pos2: [10, 5, 0],
		collision: true,
		min: 220,
		max: 250,
		spring: [10, 1],
		name: 'control-bar-right-arm'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-left-forearm-1
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'left-forearm',
		pos1: [22, 31, 0],
		pos2: [-17, 1, 0],
		collision: true,
		name: 'torso-left-forearm-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-left-forearm-2
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'left-forearm',
		pos1: [22, 29, 0],
		pos2: [-17, -1, 0],
		collision: true,
		name: 'torso-left-forearm-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// left-forearm-left-arm
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'left-forearm',
		body2: 'left-arm',
		pos1: [17, 0, 0],
		pos2: [-17, 0, 0],
		collision: true,
		name: 'left-forearm-left-arm'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// control-bar-left-arm
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'control-bar',
		body2: 'left-arm',
		pos1: [0, 0, 90],
		pos2: [10, 5, 0],
		collision: true,
		min: 220,
		max: 250,
		spring: [10, 1],
		name: 'control-bar-left-arm'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-right-thigh-1
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'right-thigh',
		pos1: [-11, -42, 0],
		pos2: [-1, 22, 0],
		collision: true,
		name: 'torso-right-thigh-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-right-thigh-2
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'right-thigh',
		pos1: [-9, -42, 0],
		pos2: [1, 22, 0],
		collision: true,
		name: 'torso-right-thigh-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-left-thigh-1
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'left-thigh',
		pos1: [8, -42, 0],
		pos2: [-1, 22, 0],
		collision: true,
		name: 'torso-left-thigh-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// torso-left-thigh-2
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'torso',
		body2: 'left-thigh',
		pos1: [11, -42, 0],
		pos2: [1, 22, 0],
		collision: true,
		name: 'torso-left-thigh-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// right-thigh-right-leg-1
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'right-thigh',
		body2: 'right-leg',
		pos1: [1, -22, 0],
		pos2: [1, 22, 0],
		collision: true,
		name: 'right-thigh-right-leg-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// right-thigh-right-leg-2
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'right-thigh',
		body2: 'right-leg',
		pos1: [-1, -22, 0],
		pos2: [-1, 22, 0],
		collision: true,
		name: 'right-thigh-right-leg-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// left-thigh-left-leg-1
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'left-thigh',
		body2: 'left-leg',
		pos1: [1, -22, 0],
		pos2: [1, 22, 0],
		collision: true,
		name: 'left-thigh-left-leg-1'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// left-thigh-left-leg-2
	obj = {
		world: world,
		type: 'jointBall',
		body1: 'left-thigh',
		body2: 'left-leg',
		pos1: [-1, -22, 0],
		pos2: [-1, 22, 0],
		collision: true,
		name: 'left-thigh-left-leg-2'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// control-bar-left-thigh
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'control-bar',
		body2: 'left-thigh',
		pos1: [-30, 0, 40],
		pos2: [0, -14, 1],
		collision: true,
		min: 340,
		max: 360,
		spring: [10, 1],
		name: 'control-bar-left-thigh'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));
	// control-bar-right-thigh
	obj = {
		world: world,
		type: 'jointDistance',
		body1: 'control-bar',
		body2: 'right-thigh',
		pos1: [-30, 0, -40],
		pos2: [0, -14, 1],
		collision: true,
		min: 340,
		max: 360,
		spring: [10, 1],
		name: 'control-bar-right-thigh'
	};
	joints.push(new OIMO.Link(obj));
	lines.push(oimoUtils.add(obj));

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

	// some constraints:
	// alpha goes ahead
	alpha = alpha;
	// beta max && min
	beta = Math.min(Math.max(beta, -85), 85);
	// gamma max && min
	gamma = Math.min(Math.max(gamma, -85), 85);

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
