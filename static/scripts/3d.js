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

	// addabox
	var geometry = new THREE.IcosahedronGeometry( 1, 0 );
	var material = new THREE.MeshBasicMaterial( {
		color: 0x88ccff,
		transparent:true,
		opacity:0.8
	} );
	var shape = new THREE.Mesh( geometry, material );
	scene.add( shape );

	// edges geometry
	var geometryEdges = new THREE.EdgesGeometry( shape.geometry ); // or WireframeGeometry
	var materialEdges = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
	var edges = new THREE.LineSegments( geometryEdges, materialEdges );
	shape.add( edges ); // add wireframe as a child of the parent mesh

	camera.position.z = 5;

	// global render loop:
	t = 0;
	breatheTime = 4.5;
	breatheRate = 1/breatheTime;
	function render() {
		t += 1/60;
		requestAnimationFrame( render );
		shape.rotation.x += 0.01;
		shape.rotation.y += 0.01;
		shape.scale.x = Math.sin( Math.PI * t * breatheRate ) * 0.75 + 1.5;
		shape.scale.y = Math.sin( Math.PI * t * breatheRate ) * 0.75 + 1.5;
		shape.scale.z = Math.sin( Math.PI * t * breatheRate ) * 0.75 + 1.5;

		renderer.render( scene, camera );
	}
	render();
};
