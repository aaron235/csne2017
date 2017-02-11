window.onload = function() {
	// make a new Three scene and color it
	var scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth*0.9 / window.innerHeight*0.9, 0.1, 1000 );

	// set up the renderer
	var renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true }
	);
	renderer.setSize( window.innerWidth*0.9, window.innerHeight*0.9 );

	// add it to the DOM
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );

	// addabox
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x0033ff } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	// edges geometry
	var geometryEdges = new THREE.EdgesGeometry( cube.geometry ); // or WireframeGeometry
	var materialEdges = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
	var edges = new THREE.LineSegments( geometryEdges, materialEdges );
	cube.add( edges ); // add wireframe as a child of the parent mesh

	camera.position.z = 5;

	// global render loop:
	t = 0;
	breatheTime = 4.5;
	breatheRate = 1/breatheTime;
	function render() {
		t += 1/60;
		requestAnimationFrame( render );
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		cube.scale.x = Math.sin( Math.PI * t * breatheRate ) + 2;
		cube.scale.y = Math.sin( Math.PI * t * breatheRate ) + 2;
		cube.scale.z = Math.sin( Math.PI * t * breatheRate ) + 2;

		renderer.render( scene, camera );
	}
	render();
};
