import * as THREE from 'three';
import { lbtPolyline3D } from "../types/LadybugGeometry"
import { appMaterials } from '../scene/Materials';

export function convertLBTPolyline3DtoLine(lbtPolyline3D: lbtPolyline3D): THREE.Line {

    const points: THREE.Vector3[] = [];
    lbtPolyline3D.vertices.forEach((point: any) => {
        const vertex = new THREE.Vector3(point[0], point[1], point[2]);
        points.push(vertex);
    });

    // Create a smooth(ish) curve through the points
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    const line = new THREE.Line(geometry, appMaterials.sunpathLineMaterial);
    return line
}