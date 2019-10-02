import React from 'react';
import * as THREE from 'three';
import { MeshBasicMaterial, MeshPhongMaterial } from 'three';

class ThreeScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phiLength : props.phiLength,
      wireframe : props.wireframe,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if(props.phiLength !== state.phiLength) newState["phiLength"] = props.phiLength;
    if(props.wireframe !== state.wireframe) newState["wireframe"] = props.wireframe;
    
    return newState;
  }

  componentDidMount() {
    let camera, scene, renderer, mesh, material;
    let shape = "torus";

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

    let addGeometry = (type) => {
      console.log(this);
      switch(type) {
        case "torus":
          addTorus();
          break;
        case "sphere":
          addSphere();
          break;
        case "cylinder":
          addCylinder();
          break;
        case "polyhedron":
          addPolyhedron();
          break;
        default:
      }
    }

    let addTorus = () => {
      let phiLen = this.state.phiLength;
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

    let addPolyhedron = () => {
      let phiLen = 4.7;
      let radius = 200;
      let segments = 8;

      let polyhedron = new THREE.SphereGeometry(radius, 2, segments, 0, phiLen);

      let semiStart = new THREE.CircleGeometry(radius, segments, 0, Math.PI);
      semiStart.applyMatrix(rotationMatrix("z", Math.PI / 2));
      semiStart.applyMatrix(rotationMatrix("x", Math.PI));

      let semiEnd = new THREE.CircleGeometry(radius, segments, 0, Math.PI);
      semiEnd.applyMatrix(rotationMatrix("z", Math.PI / 2));
      semiEnd.applyMatrix(rotationMatrix("y", phiLen));

      let geometry = new THREE.Geometry();
      geometry.merge(polyhedron);
      geometry.merge(semiStart);
      geometry.merge(semiEnd);

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    let addCylinder = () => {
      let phiLen = 4.7;
      let radius = 200;
      let height = 300;

      let cylinder = new THREE.CylinderGeometry(radius, radius, height, 32, 32, false, 0, phiLen);

      let rectStart = new THREE.PlaneGeometry(radius, height);
      rectStart.applyMatrix(rotationMatrix("y", Math.PI / 2));
      rectStart.applyMatrix(positionMatrix(0, 0, radius/2));

      let rectEnd = new THREE.PlaneGeometry(radius, height);
      rectEnd.applyMatrix(rotationMatrix("y", Math.PI / 2 +  phiLen));
      rectEnd.applyMatrix(positionMatrix(Math.sin(phiLen) * 0.5 * radius, 0, Math.cos(phiLen) * 0.5 * radius));

      let geometry = new THREE.Geometry();
      geometry.merge(cylinder);
      geometry.merge(rectStart);
      geometry.merge(rectEnd);

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    let addSphere = () => {
      let phiLen = this.state.phiLength;
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

    let init = () => {
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
      if (this.state.wireframe) {
        material = new MeshBasicMaterial();
        material.color.set("turquoise");
        material.wireframe = true;
      }
      else {
        material = new MeshPhongMaterial();
        material.color.set("turquoise");
      }

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

    init();
    addGeometry(shape);
    animate();
  }
  render() {
    return <div ref={ref => (this.mount = ref)} />;
  }
};

export default ThreeScene;
