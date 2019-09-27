let camera, scene, renderer, mesh, material;
init();
testGeometry();
//addGeometry();
animate();

function addGeometry() {
    // Create sphere and add to scene.
    let phiLen = 5;
    let sphereGeometry = new THREE.SphereGeometry(radius = 200, widthSegments = 32, heightSegments = 32, phiStart = 0, phiLength = phiLen);
    let sphereMesh = new THREE.Mesh(sphereGeometry, material);

    let semi1Geometry = new THREE.CircleGeometry(radius = 200, segments = 32, thetaStart = 0, thetaLength = Math.PI);
    let semi1Mesh = new THREE.Mesh(semi1Geometry, material);
    semi1Mesh.rotation.z = Math.PI / 2;
    semi1Mesh.rotation.x = Math.PI;

    let semi2Geometry = new THREE.CircleGeometry(radius = 200, segments = 32, thetaStart = 0, thetaLength = Math.PI);
    let semi2Mesh = new THREE.Mesh(semi2Geometry, material);
    semi2Mesh.rotation.z = Math.PI / 2;
    semi2Mesh.rotation.y = phiLen;

    let geometry = new THREE.Geometry();
    sphereMesh.updateMatrix();
    geometry.merge(sphereMesh.geometry, sphereMesh.matrix);
    semi1Mesh.updateMatrix();
    geometry.merge(semi1Mesh.geometry, semi1Mesh.matrix);
    semi2Mesh.updateMatrix();
    geometry.merge(semi2Mesh.geometry, semi2Mesh.matrix);
    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
}

function testGeometry() {
    let phiLength = 2;
    let geometry = new THREE.Geometry();
    let sphereGeometry = new THREE.SphereGeometry(1, 32, 32, 0, phiLength);
    
    /*
    let zRotationMatrix = new THREE.Matrix4.makeRotationZ(Math.PI / 2);
    let xRotationMatrix = new THREE.Matrix4.makeRotationX(Math.PI);
    let yRotationMatrix = new THREE.Matrix4.makeRotationY(phiLength);
    */

    let semi1Geometry = new THREE.CircleGeometry(1, 32, 0, Math.PI);
    semi1Geometry.rotateZ(Math.PI / 2).rotateX(Math.PI);
    
    let semi2Geometry = new THREE.CircleGeometry(1, 32, 0, Math.PI);
    semi2Geometry.rotateZ(Math.PI / 2).rotateY(phiLength);

    let faces = semi1Geometry.faces.concat(semi2Geometry.faces).concat(sphereGeometry.faces);
    let vertices = semi1Geometry.vertices.concat(semi2Geometry.vertices).concat(sphereGeometry.vertices);

    for(vertex in vertices) {
        vertex.isVector3 ? geometry.vertices.push(vertex) : ()=>{};
    }
    //geometry.mergeVertices();
    console.log(geometry.vertices);
    geometry.computeBoundingBox();

    for(face in faces) {
        geometry.faces.push(face);
    }
    geometry.elementsNeedUpdate = true;
    
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function init() {
    // Renderer.
    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Add renderer to page
    document.body.appendChild(renderer.domElement);

    // Create camera.
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    // Create scene.
    scene = new THREE.Scene();

    // Create material
    material = new THREE.MeshPhongMaterial();
    material.color.set("turquoise");
    //material.wireframe = true;

    // Create ambient light and add to scene.
    let light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
        
    // Create pint light and add to scene.
    let pointLight = new THREE.PointLight( 0xff0000, 1, 800 );
    scene.add(pointLight);

    // Create directional light and add to scene.
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Add listener for window resize.
    window.addEventListener('resize', onWindowResize, false);

    // Add stats to page.
    //stats = new Stats();
    //document.body.appendChild( stats.dom );
}

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}