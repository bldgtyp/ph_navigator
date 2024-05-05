import * as THREE from 'three';
import { lbtLineSegment3D } from "../types/LadybugGeometry"
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';


export function convertLBTLineSegment3DtoLine(
    lbtLineSegment2D: lbtLineSegment3D,
    smooth: boolean = false,
): LineSegmentsGeometry {
    const points: THREE.Vector3[] = [];
    const v1 = new THREE.Vector3(lbtLineSegment2D.p[0], lbtLineSegment2D.p[1], lbtLineSegment2D.p[2],)
    const v2 = new THREE.Vector3(
        lbtLineSegment2D.v[0] + lbtLineSegment2D.p[0],
        lbtLineSegment2D.v[1] + lbtLineSegment2D.p[1],
        lbtLineSegment2D.v[2] + lbtLineSegment2D.p[2]
    )
    points.push(v1);
    points.push(v2);

    if (smooth == true) {
        // Create a smooth(ish) curve through the points
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
        const eg = new THREE.EdgesGeometry(geometry);
        return new LineSegmentsGeometry().fromEdgesGeometry(eg);
        //const line = new THREE.Line(geometry);
        // return line
    } else {
        // Create a straight line through the points
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const eg = new THREE.EdgesGeometry(geometry);
        return new LineSegmentsGeometry().fromEdgesGeometry(eg);
        // const line = new THREE.Line(geometry);
        // return line;
    }
}