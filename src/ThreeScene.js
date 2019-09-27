import React from 'react';
import * as THREE from 'three';

class ThreeScene extends React.Component {
  componentDidMount() { 
    console.log("we got here\n");
    let camera, scene, renderer, mesh, material;
    init();
    addSphere();
    animate();

  function addSphere() {
      let phiLen = 5;
      let rotationMatrix = (axis, theta) => {
        let matrix = new THREE.Matrix4();
        switch(axis) {
          case "x":
            matrix.makeRotationX(theta);
            break;
          case "y":
            matrix.makeRotationY(theta);
            break;
          case "z":
            matrix.makeRotationZ(theta);
            break;
          default:
        }
        return matrix;
      }

      let sphereGeometry = new THREE.SphereGeometry(200, 32, 32, 0, phiLen);

      let semi1Geometry = new THREE.CircleGeometry(200, 32, 0, Math.PI);
      semi1Geometry.applyMatrix(rotationMatrix("z", Math.PI / 2));
      semi1Geometry.applyMatrix(rotationMatrix("x", Math.PI));

      let semi2Geometry = new THREE.CircleGeometry(200, 32, 0, Math.PI);
      semi2Geometry.applyMatrix(rotationMatrix("z", Math.PI / 2));
      semi2Geometry.applyMatrix(rotationMatrix("y", phiLen));

      let geometry = new THREE.Geometry();
      geometry.merge(sphereGeometry);
      geometry.merge(semi1Geometry);
      geometry.merge(semi2Geometry);

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
  }
  render() {
    return <div ref={ref => (this.mount = ref)} />;
  }
};

export default ThreeScene;
