import * as THREE from 'three';
import { lbtArc2D } from "../types/LadybugGeometry"
import { appMaterials } from '../scene/Materials';

export function convertLBTArc2DtoLine(lbtArc2D: lbtArc2D): THREE.Line {
    // Solution provided by GitHub CoPilot.

    // Assuming lbtArc3D is your object with radius, a1, a2, and LadybugPlane information
    const { r, c, a1, a2 } = lbtArc2D;

    // Create an elliptical curve
    const curve = new THREE.EllipseCurve(
        0, 0, // aX, aY
        r, r, // xRadius, yRadius
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
    matrix.makeTranslation(c[0], c[1], 0);

    // Apply the transformation to the line
    line.applyMatrix4(matrix);

    return line
}