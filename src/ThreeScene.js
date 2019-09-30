import React from 'react';
import * as THREE from 'three';

class ThreeScene extends React.Component {
  componentDidMount() {
    let camera, scene, renderer, mesh, material;
    init();
    //addSphere();
    addTorus();
    animate();

    function rotationMatrix(axis, theta) {
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

    function positionMatrix(x, y, z) {
      let matrix = new THREE.Matrix4();
      let position = new THREE.Vector3(x, y, z);

      matrix.setPosition(position);
      return matrix;
    }

    function addTorus() {
      let phiLen = 4;
      let radius = 150;
      let width = 40;

      let torusGeometry = new THREE.TorusGeometry(radius, width, 32, 32, phiLen);

      let circleStart = new THREE.CircleGeometry(width, 32, 0, Math.PI * 2);
      circleStart.applyMatrix(rotationMatrix("x", Math.PI / 2));
      circleStart.applyMatrix(positionMatrix(radius, 0, 0));

      let circleEnd = new THREE.CircleGeometry(width, 32, 0, Math.PI * 2);
      circleEnd.applyMatrix(rotationMatrix("y", Math.PI / 2));
      circleEnd.applyMatrix(rotationMatrix("z", Math.PI / 2 + phiLen));
      circleEnd.applyMatrix(positionMatrix(Math.cos(phiLen) * radius, Math.sin(phiLen) * radius, 0));

      let geometry = new THREE.Geometry();
      geometry.merge(torusGeometry);
      geometry.merge(circleStart);
      geometry.merge(circleEnd);

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }



    function addSphere() {
      let phiLen = 5;
      let radius = 200;

      let sphere = new THREE.SphereGeometry(radius, 32, 32, 0, phiLen);

      let semiStart = new THREE.CircleGeometry(radius, 32, 0, Math.PI);
      semiStart.applyMatrix(rotationMatrix("z", Math.PI / 2));
      semiStart.applyMatrix(rotationMatrix("x", Math.PI));

      let semiEnd = new THREE.CircleGeometry(radius, 32, 0, Math.PI);
      semiEnd.applyMatrix(rotationMatrix("z", Math.PI / 2));
      semiEnd.applyMatrix(rotationMatrix("y", phiLen));

      let geometry = new THREE.Geometry();
      geometry.merge(sphere);
      geometry.merge(semiStart);
      geometry.merge(semiEnd);

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
      material = new THREE.MeshBasicMaterial();
      //material = new THREE.MeshPhongMaterial();
      material.color.set("turquoise");
      material.wireframe = true;

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
