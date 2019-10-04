import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import PhiGeometries from './PhiGeometries';

class ThreeScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phiLength: props.phiLength,
      wireframe: props.wireframe,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (props.phiLength !== state.phiLength) newState["phiLength"] = props.phiLength;
    if (props.wireframe !== state.wireframe) newState["wireframe"] = props.wireframe;

    return newState;
  }

  componentDidMount() {
    let shape = "torus";
    let phiLength = 2;

    let addGeometry = (type, phiLength = Math.PI) => {
      //eslint-disable-next-line
      switch (type) {
        case "torus":
          this.mesh = (new THREE.Mesh(PhiGeometries.torus(phiLength), this.material));
          break;
        case "sphere":
          this.mesh = (new THREE.Mesh(PhiGeometries.sphere(phiLength), this.material));
          break;
        case "cylinder":
          this.mesh = (new THREE.Mesh(PhiGeometries.cylinder(phiLength), this.material));
          break;
        case "polyhedron":
          this.mesh = (new THREE.Mesh(PhiGeometries.polyhedron(phiLength), this.material));
          break;
        default:
      }
      this.scene.add(this.mesh);
    }

    this.init();
    this.animate();
    addGeometry(shape, phiLength);
  }

  init() {
    this.id = null;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 400;
    this.controls = new OrbitControls( this.camera, this.mesh );

    if (this.state.wireframe) {
      this.material = new THREE.MeshBasicMaterial();
      this.material.color.set("turquoise");
      this.material.wireframe = true;
    } else {
      this.material = new THREE.MeshPhongMaterial();
      this.material.color.set("turquoise");
    }
    // Add renderer to page
    document.body.appendChild(this.renderer.domElement);
    // Add listener for window resize.
    window.addEventListener('resize', this.handleWindowResize, false);

    // Create ambient light and add to scene.
    this.scene.add(new THREE.AmbientLight(0x404040)); //soft white light
    // Create pint light and add to scene.
    this.scene.add(new THREE.PointLight(0xff0000, 1, 800));
    // Create directional light and add to scene.
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);
  }

  animate = (mesh) => {
    this.id = requestAnimationFrame( this.animate );
    this.renderer.render(this.scene, this.camera);
  }

  handleWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    cancelAnimationFrame(this.id);
    this.controls.dispose();
  }

  render() {  
    return <div ref = {
      ref => (this.mount = ref)
    }
    />;
  }
};

export default ThreeScene;