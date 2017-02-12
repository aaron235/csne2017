window.userState = {
	power: {
		delta: 0,
		theta: 0,
		alpha: 0,
		mu: 0,
		beta: 0,
		gamma: 0
	}
};

window.targetUserState = {
	power: {
		delta: 0,
		theta: 0,
		alpha: 0,
		mu: 0,
		beta: 0,
		gamma: 0
	}
};

window.visState = {
	breatheTime: 5,
	rotationSpeed: 0.01,
	rotationJitter: 0,
	color: 0xccaaff,
	t: 0
};

window.visState.breatheRate = 1/window.visState.breatheTime;

window.onload = function() {
	// make a new Three scene and color it
	var scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


	// set up the renderer
	var renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true }
	);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth * 0.9 , window.innerHeight * 0.9 );

	// add it to the DOM
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );

	// this gives us some nested polyhedra
	shapes = makeGeometry( scene );
	shape = shapes[0];
	console.log( shapes );

	shapes.map( function( shape ) {
		scene.add( shape );
	} );

	camera.position.z = 5;

	// global render loop:
	function render() {
		window.visState.t += 1/60;
		requestAnimationFrame( render );

		scaleOffset = 0;
		spinOffset = 1;

		shapes.map( function( shape ) {
			shape.rotation.x += 0.01 * spinOffset;
			shape.rotation.y += 0.01 * spinOffset;
			shape.scale.x = Math.sin( Math.PI * window.visState.t * window.visState.breatheRate + scaleOffset ) * 0.75 + 1.5;
			shape.scale.y = Math.sin( Math.PI * window.visState.t * window.visState.breatheRate + scaleOffset ) * 0.75 + 1.5;
			shape.scale.z = Math.sin( Math.PI * window.visState.t * window.visState.breatheRate + scaleOffset ) * 0.75 + 1.5;
			scaleOffset += 0.3;
			spinOffset = -spinOffset;

		} );

		renderer.render( scene, camera );
	}
	render();
};


function makeGeometry( scene ) {
	var largeGeometry = new THREE.IcosahedronGeometry( 1, 0 );
	var mediumGeometry = new THREE.DodecahedronGeometry( 0.75, 0 );
	var smallGeometry = new THREE.OctahedronGeometry( 0.5, 0 );

	var material = new THREE.MeshBasicMaterial( {
		color: 0x88ccff,
		transparent:true,
		opacity:0.5
	} );

	var largeShape = new THREE.Mesh( largeGeometry, material );
	var mediumShape = new THREE.Mesh( mediumGeometry, material );
	var smallShape = new THREE.Mesh( smallGeometry, material );

	shapes = [smallShape, mediumShape, largeShape];

	shapes.map( function( shape ) {
		var geometryEdges = new THREE.EdgesGeometry( shape.geometry ); // or WireframeGeometry
		var materialEdges = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
		var edges = new THREE.LineSegments( geometryEdges, materialEdges );
		return shape.add( edges ); // add wireframe as a child of the parent mesh
	} );

	return shapes;
}

///////////////////////
// Websockets stuff: //
///////////////////////

var ws = new WebSocket( 'ws://localhost:5000/data' );
ws.onopen = function(){
	/*Send a small message to the console once the connection is established */
	console.log('Connection open!');
	ws.send( JSON.stringify( {'lol': 'weeny'} ) );
};

ws.onmessage = function( e ) {
	console.log( e );
	d = JSON.parse( e.data );
	console.log( d );
};

ws.onerror = function( e ) {
	//d = JSON.parse(event.data);
	console.log( "lol error" );
};
