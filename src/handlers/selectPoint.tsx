import * as THREE from 'three';
const raycaster = new THREE.Raycaster();

export function selectPoint(pointer: any, world: any, tolerance: number = 0.5): THREE.Vector3 | null {
    // Perform the ray-cast intersection
    raycaster.setFromCamera(pointer, world.camera);
    const intersects = raycaster.intersectObject(world.buildingGeometryVertices, true);
    const intersect = intersects.find(intersect => intersect.object instanceof THREE.Points) || null;
    if (!intersect || intersect.distanceToRay === undefined || intersect.distanceToRay > tolerance) {
        return null;
    }

    const { object, index } = intersect;

    if (!(object instanceof THREE.Points) || index === undefined) {
        return null;
    }

    // Get the vertex position and build a new Vector3
    const geom: THREE.BufferGeometry = object.geometry;
    const values: THREE.TypedArray = geom.attributes.position.array;
    const startingIndex = index * geom.attributes.position.itemSize;
    const updatedVertex = new THREE.Vector3(values[startingIndex], values[startingIndex + 1], values[startingIndex + 2]);
    return updatedVertex
}