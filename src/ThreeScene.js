import React from 'react';
import * as THREE from 'three';
import PhiGeometries from './PhiGeometries';
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
    let phiLength = 2;

    let addGeometry = (type, phiLength = Math.PI) => {
      console.log(this);
      switch(type) {
        case "torus":
          scene.add(new THREE.Mesh(PhiGeometries.torus(phiLength), material));
          break;
        case "sphere":
          scene.add(new THREE.Mesh(PhiGeometries.sphere(phiLength), material));
          break;
        case "cylinder":
          scene.add(new THREE.Mesh(PhiGeometries.cylinder(phiLength), material));
          break;
        case "polyhedron":
          scene.add(new THREE.Mesh(PhiGeometries.polyhedron(phiLength), material));
          break;
        default:
      }
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
    addGeometry(shape, phiLength);
    animate();
  }

  componentWillUnmount() {

  }

  render() {
    return <div ref={ref => (this.mount = ref)} />;
  }
};

export default ThreeScene;
