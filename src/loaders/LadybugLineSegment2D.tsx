import * as THREE from 'three';
import { lbtLineSegment2D } from "../types/ladybug_geometry/geometry2d/line";
import { appMaterials } from '../scene/Materials';

export function convertLBTLineSegment2DtoLine(lbtLineSegment2D: lbtLineSegment2D): THREE.Line {

    const points: THREE.Vector3[] = [];
    const v1 = new THREE.Vector3(lbtLineSegment2D.p[0], lbtLineSegment2D.p[1], 0)
    const v2 = new THREE.Vector3(lbtLineSegment2D.v[0] + lbtLineSegment2D.p[0], lbtLineSegment2D.v[1] + lbtLineSegment2D.p[1], 0)
    points.push(v1);
    points.push(v2);

    // Create a smooth(ish) curve through the points
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    const line = new THREE.Line(geometry, appMaterials.sunpathLineMaterial);
    return line
}