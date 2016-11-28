"use strict";

var scene,
	geos = {},
	mats = {};

var basicTexture = function (n, r) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext( '2d' );
    var color;
    if(n===0) color = "#58C3FF";// sphere
    if(n===1) color = "#3580AA";// sphere sleep
    if(n===2) color = "#FFAA58";// box
    if(n===3) color = "#AA8038";// box sleep
    if(n===4) color = "#1d1f20";// static
    if(n===5) color = "#58FFAA";// cyl
    if(n===6) color = "#38AA80";// cyl sleep
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "rgba(0,0,0,0.1);";//colors[1];
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    var tx = new THREE.Texture(canvas);
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    tx.repeat = new THREE.Vector2( r || 1, r || 1);
    tx.needsUpdate = true;
    return tx;
};	

var ToRad = Math.PI/180,
	ToDeg = 180 / Math.PI;

var init = function () {
	geos['sph'] = new THREE.BufferGeometry();
	geos['box'] = new THREE.BufferGeometry();
	geos['cyl'] = new THREE.BufferGeometry();
	geos['sph'].fromGeometry( new THREE.SphereGeometry(1,12,10)); 
	geos['cyl'].fromGeometry( new THREE.CylinderGeometry(0.5,0.5,1,12,1));  
	geos['box'].fromGeometry( new THREE.BoxGeometry(1,1,1));
	geos['plane'] = new THREE.PlaneBufferGeometry(1,1);
	geos['plane'].applyMatrix(new THREE.Matrix4().makeRotationX(-90 * ToRad));
	//
	mats['sph'] = new THREE.MeshLambertMaterial( { map: basicTexture(0), name:'sph' } );
	mats['ssph'] = new THREE.MeshLambertMaterial( { map: basicTexture(1), name:'ssph' } );
	mats['box'] = new THREE.MeshLambertMaterial( { map: basicTexture(2), name:'box' } );
	mats['sbox'] = new THREE.MeshLambertMaterial( { map: basicTexture(3), name:'sbox' } );
	mats['cyl'] = new THREE.MeshLambertMaterial( { map: basicTexture(5), name:'cyl' } );
	mats['scyl'] = new THREE.MeshLambertMaterial( { map: basicTexture(6), name:'scyl' } );
	mats['static'] = new THREE.MeshLambertMaterial( { map: basicTexture(4), name:'static' } );
	mats['static2'] = new THREE.MeshLambertMaterial( { map: basicTexture(4, 6), name:'static2' } );
	mats['joint']  = new THREE.LineBasicMaterial( { color: 0x00FF00 } );
};

module.exports = {
	init: function (_scene) {
		scene = _scene;
		init();
	},
	add: function (obj, target) {
		var type = obj.type || 'box';
		var size = obj.size || [10,10,10];
		var pos = obj.pos || [0,0,0];
		var rot = obj.rot || [0,0,0];
		var move = obj.move || false;
		if(obj.flat){ type = 'plane'; pos[1]+=size[1]*0.5; }
		//
		if(type.substring(0,5) === 'joint'){//_____________ Joint
			var joint;
			var pos1 = obj.pos1 || [0,0,0];
			var pos2 = obj.pos2 || [0,0,0];
			var geo = new THREE.Geometry();
			geo.vertices.push( new THREE.Vector3( pos1[0], pos1[1], pos1[2] ) );
			geo.vertices.push( new THREE.Vector3( pos2[0], pos2[1], pos2[2] ) );
			joint = new THREE.Line( geo, mats.joint, THREE.LinePieces );
			if(target) target.add( joint );
			else scene.add( joint );
			return joint;
		} else {//_____________ Object
			var mesh;
			if(type=='box' && move) mesh = new THREE.Mesh( geos.box, mats.box );
			if(type=='box' && !move) mesh = new THREE.Mesh( geos.box, mats.static);
			if(type=='plane' && !move) mesh = new THREE.Mesh( geos.plane, mats.static2);
			if(type=='sphere' && move) mesh = new THREE.Mesh( geos.sph, mats.sph );
			if(type=='sphere' && !move) mesh = new THREE.Mesh( geos.sph, mats.static);
			if(type=='cylinder' && move) mesh = new THREE.Mesh( geos.cyl, mats.cyl );
			if(type=='cylinder' && !move) mesh = new THREE.Mesh( geos.cyl, mats.static);
			mesh.scale.set( size[0], size[1], size[2] );
			mesh.position.set( pos[0], pos[1], pos[2] );
			mesh.rotation.set( rot[0]*ToRad, rot[1]*ToRad, rot[2]*ToRad );
			if(target)target.add( mesh );
			else scene.add( mesh );
			return mesh;
		}
	}
};