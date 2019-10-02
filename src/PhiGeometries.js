import * as THREE from "three";

const PhiGeometries = {
    rotationMatrix(axis, theta) {
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
    },

    positionMatrix(x, y, z) {
        let matrix = new THREE.Matrix4();
        let position = new THREE.Vector3(x, y, z);

        matrix.setPosition(position);
        return matrix;
    },

    torus(phiLength) {
        let radius = 150;
        let width = 40;

        let torusGeometry = new THREE.TorusGeometry(radius, width, 32, 32, phiLength);

        let circleStart = new THREE.CircleGeometry(width, 32, 0, Math.PI * 2);
        circleStart.applyMatrix(this.rotationMatrix("x", Math.PI / 2));
        circleStart.applyMatrix(this.positionMatrix(radius, 0, 0));

        let circleEnd = new THREE.CircleGeometry(width, 32, 0, Math.PI * 2);
        circleEnd.applyMatrix(this.rotationMatrix("y", Math.PI / 2));
        circleEnd.applyMatrix(this.rotationMatrix("z", Math.PI / 2 + phiLength));
        circleEnd.applyMatrix(this.positionMatrix(Math.cos(phiLength) * radius, Math.sin(phiLength) * radius, 0));

        let geometry = new THREE.Geometry();
        geometry.merge(torusGeometry);
        geometry.merge(circleStart);
        geometry.merge(circleEnd);

        return geometry;
    },

    polyhedron(phiLength) {
        let radius = 200;
        let segments = 8;

        let polyhedron = new THREE.SphereGeometry(radius, 2, segments, 0, phiLength);

        let semiStart = new THREE.CircleGeometry(radius, segments, 0, Math.PI);
        semiStart.applyMatrix(this.rotationMatrix("z", Math.PI / 2));
        semiStart.applyMatrix(this.rotationMatrix("x", Math.PI));

        let semiEnd = new THREE.CircleGeometry(radius, segments, 0, Math.PI);
        semiEnd.applyMatrix(this.rotationMatrix("z", Math.PI / 2));
        semiEnd.applyMatrix(this.rotationMatrix("y", phiLength));

        let geometry = new THREE.Geometry();
        geometry.merge(polyhedron);
        geometry.merge(semiStart);
        geometry.merge(semiEnd);

        return geometry;
    },

    cylinder(phiLength) {
        let radius = 200;
        let height = 300;

        let cylinder = new THREE.CylinderGeometry(radius, radius, height, 32, 32, false, 0, phiLength);

        let rectStart = new THREE.PlaneGeometry(radius, height);
        rectStart.applyMatrix(this.rotationMatrix("y", Math.PI / 2));
        rectStart.applyMatrix(this.positionMatrix(0, 0, radius/2));

        let rectEnd = new THREE.PlaneGeometry(radius, height);
        rectEnd.applyMatrix(this.rotationMatrix("y", Math.PI / 2 +  phiLength));
        rectEnd.applyMatrix(this.positionMatrix(Math.sin(phiLength) * 0.5 * radius, 0, Math.cos(phiLength) * 0.5 * radius));

        let geometry = new THREE.Geometry();
        geometry.merge(cylinder);
        geometry.merge(rectStart);
        geometry.merge(rectEnd);

        return geometry;
    },

    sphere(phiLength) {
        let radius = 200;

        let sphere = new THREE.SphereGeometry(radius, 32, 32, 0, phiLength);

        let semiStart = new THREE.CircleGeometry(radius, 32, 0, Math.PI);
        semiStart.applyMatrix(this.rotationMatrix("z", Math.PI / 2));
        semiStart.applyMatrix(this.rotationMatrix("x", Math.PI));

        let semiEnd = new THREE.CircleGeometry(radius, 32, 0, Math.PI);
        semiEnd.applyMatrix(this.rotationMatrix("z", Math.PI / 2));
        semiEnd.applyMatrix(this.rotationMatrix("y", phiLength));

        let geometry = new THREE.Geometry();
        geometry.merge(sphere);
        geometry.merge(semiStart);
        geometry.merge(semiEnd);

        return geometry;
    },
}

export default PhiGeometries;