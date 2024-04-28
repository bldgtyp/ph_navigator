import { SceneSetup } from '../scene/SceneSetup';
import * as THREE from 'three';

var marker = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({
    color: 0xFFc8FF
}));
marker.position.setScalar(1000);

function setPos(faceIndex: any, intersectObject: any, intersectPoint: any) {
    // https://jsfiddle.net/prisoner849/jx9rfq5n/
    var idx = 0;
    var bc = new THREE.Vector3();
    var pos = new THREE.Vector3();
    var tri = new THREE.Triangle();
    var tp = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
    ];

    // Build a Triangle for the face
    tp[0].fromBufferAttribute(intersectObject.geometry.attributes.position, faceIndex * 3 + 0);
    tp[1].fromBufferAttribute(intersectObject.geometry.attributes.position, faceIndex * 3 + 1);
    tp[2].fromBufferAttribute(intersectObject.geometry.attributes.position, faceIndex * 3 + 2);
    tri.set(tp[0], tp[1], tp[2]);

    // Find the closest vertex point
    tri.getBarycoord(intersectPoint, bc);
    if (bc.x > bc.y && bc.x > bc.z) {
        idx = 0;
    } else if (bc.y > bc.x && bc.y > bc.z) {
        idx = 1;
    } else if (bc.z > bc.x && bc.z > bc.y) {
        idx = 2;
    }
    return pos.copy(tp[idx]);
}

function getIntersectionFromMouseClick(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
): THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> | null {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    ray_caster.setFromCamera(pointer, world.camera);

    // Find the First (closets to camera) object intersecting the picking ray
    const intersects = ray_caster.intersectObjects(world.scene.children);
    const intersect = intersects.find(intersect => intersect.object instanceof THREE.Mesh) || null;
    return intersect ? intersect : null;
};

export function onMouseMove(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
    appState: React.MutableRefObject<number | null>,
) {
    if (appState.current === 0) {
        world.scene.remove(marker);
    } else if (appState.current === 1) {
        var intersectPoint = new THREE.Vector3();
        const intersect = getIntersectionFromMouseClick(event, ray_caster, world);
        if (intersect && intersect.object instanceof THREE.Mesh) {
            intersectPoint.copy(intersect.point);
            intersect.object.worldToLocal(intersectPoint);
            const faceVertex = setPos(intersect.faceIndex, intersect.object, intersectPoint);
            intersect.object.localToWorld(faceVertex);
            world.scene.add(marker);
            marker.position.copy(faceVertex);
        };
    } else {
        world.scene.remove(marker);
    }
}
