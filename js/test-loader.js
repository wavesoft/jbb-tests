
// Get dependencies
var THREE = require("three");
var BundlesLoader = require("jbb/decoder");
var profileTable = require("jbb-profile-three");
var bundleLoader = new BundlesLoader( profileTable );

var Viewport = require("./common/viewport");


// Get model from bundle
bundleLoader.add("build/bundles/animated.jbb");
bundleLoader.load( function() {

	var geometry = bundleLoader.database['animated/monster'];
	var materials = bundleLoader.database['animated/monster:extra'];

	console.log(geometry);
	console.log(materials);

	// Get monster from database
	var faceMaterial = new THREE.MeshFaceMaterial( materials );
	var monster = new THREE.Mesh( geometry, faceMaterial );
	monster.scale.set( 0.15, 0.15, 0.15);
	monster.position.set( 400, -200, -200 );
	monster.rotation.y = -Math.PI/2;
	Viewport.scene.add( monster );

	// Add monster animation
	var mixer = new THREE.AnimationMixer( monster );
	mixer.addAction( new THREE.AnimationAction( monster.geometry.animations[0] ).warpToDuration( 1 ) );
	Viewport.addAnimationFunction( mixer.update.bind(mixer) );

	window.db = bundleLoader.database;

});

// 	// Get model from bundle
// 	bundleLoader.add("build/bundles/animated.jbbp");
// 	bundleLoader.load( function() {

// 		var geometry = bundleLoader.database['animated/monster'];
// 		var materials = bundleLoader.database['animated/monster:extra'];

// 		// adjust color a bit

// 		var material = materials[ 0 ];
// 		material.morphTargets = true;
// 		material.color.setHex( 0xffaaaa );

// 		var faceMaterial = new THREE.MeshFaceMaterial( materials );

// 		for ( var i = 0; i < 729; i ++ ) {

// 			// random placement in a grid

// 			var x = ( ( i % 27 )  - 13.5 ) * 2 + THREE.Math.randFloatSpread( 1 );
// 			var z = ( Math.floor( i / 27 ) - 13.5 ) * 2 + THREE.Math.randFloatSpread( 1 );

// 			// leave space for big monster

// 			if ( Math.abs( x ) < 2 && Math.abs( z ) < 2 ) continue;

// 			morph = new THREE.MorphAnimMesh( geometry, faceMaterial );

// 			// one second duration

// 			morph.duration = 1000;

// 			// random animation offset

// 			morph.time = 1000 * Math.random();

// 			var s = THREE.Math.randFloat( 0.00075, 0.001 );
// 			morph.scale.set( s, s, s );

// 			morph.position.set( x, 0, z );
// 			morph.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );

// 			morph.matrixAutoUpdate = false;
// 			morph.updateMatrix();

// 			scene.add( morph );

// 			morphs.push( morph );

// 		}

// 	});

// 	// Lights

// 	scene.add( new THREE.AmbientLight( 0xcccccc ) );

// 	pointLight = new THREE.PointLight( 0xff4400, 5, 30 );
// 	pointLight.position.set( 5, 0, 0 );
// 	scene.add( pointLight );

// 	// Renderer

// 	renderer = new THREE.WebGLRenderer();
// 	renderer.setPixelRatio( window.devicePixelRatio );
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	container.appendChild( renderer.domElement );

// 	// Events

// 	window.addEventListener( 'resize', onWindowResize, false );

// }

// //

// function onWindowResize( event ) {

// 	renderer.setSize( window.innerWidth, window.innerHeight );

// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();

// }

// //

// function animate() {

// 	requestAnimationFrame( animate );

// 	var delta = clock.getDelta();

// 	if ( morphs.length ) {

// 		for ( var i = 0; i < morphs.length; i ++ )
// 			morphs[ i ].updateAnimation( 1000 * delta );

// 	}

// 	render();

// }

// function render() {

// 	var timer = Date.now() * 0.0005;

// 	camera.position.x = Math.cos( timer ) * 10;
// 	camera.position.y = 4;
// 	camera.position.z = Math.sin( timer ) * 10;

// 	camera.lookAt( scene.position );

// 	renderer.render( scene, camera );

// }

// init();
// animate();
