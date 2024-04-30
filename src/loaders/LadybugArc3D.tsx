import * as THREE from 'three';
import { lbtArc3D } from "../types/LadybugGeometry"
import { appMaterials } from '../scene/Materials';

const material = new THREE.LineBasicMaterial({ color: 0xff1100 });

export function convertLBTArc3DtoLine(lbtArc3D: lbtArc3D): THREE.Line {
    // Solution provided by GitHub CoPilot.

    // Assuming lbtArc3D is your object with radius, a1, a2, and LadybugPlane information
    const { radius, a1, a2, plane } = lbtArc3D;

    // Create an elliptical curve
    const curve = new THREE.EllipseCurve(
        0, 0, // aX, aY
        radius, radius, // xRadius, yRadius
        a1, a2, // aStartAngle, aEndAngle
        false, // aClockwise
        0 // aRotation
    );

    // Create a curve path and add the elliptical curve to it
    const path = new THREE.CurvePath();
    path.add(curve);

    // Generate points from the curve
    const points = curve.getPoints(50);

    // Create a geometry from the points
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create the line
    const line = new THREE.Line(geometry, appMaterials.sunpathLineMaterial);

    // Create a matrix for the transformation
    const matrix = new THREE.Matrix4();

    // Set the matrix to the transformation you want
    matrix.makeTranslation(plane.o[0], plane.o[1], plane.o[2]);

    // Apply the transformation to the line
    line.applyMatrix4(matrix);

    // Set the matrix to the rotation you want
    matrix.makeRotationX(Math.PI / 2); // Rotate 90 degrees around the X axis

    // Create a vector for the plane's normal
    const normal = new THREE.Vector3(plane.n[0], plane.n[1], plane.n[2]);

    // Orient the line to face the plane's normal
    line.lookAt(normal);

    return line
}