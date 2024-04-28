import '../styles/DimensionLines.css';
import { SceneSetup } from '../scene/SceneSetup';
import * as THREE from 'three';
import { appMaterials } from '../scene/Materials';

function getSelectedMeshFromMouseClick(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
): THREE.Mesh | null {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    ray_caster.setFromCamera(pointer, world.camera);

    // Find the First (closets to camera) object intersecting the picking ray
    const intersects = ray_caster.intersectObjects(world.buildingGeometry.children);
    const mesh = intersects.find(intersect => intersect.object instanceof THREE.Mesh) || null;
    return mesh ? mesh.object as THREE.Mesh : null;
};

export function handleClearSelectedMesh(
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
) {
    if (selectedObjectRef && selectedObjectRef.current instanceof THREE.Mesh) {
        if ((selectedObjectRef.current as THREE.Mesh).userData["face_type"] == "Aperture") {
            selectedObjectRef.current.material = appMaterials.geometryWindowMaterial;
        } else {
            selectedObjectRef.current.material = appMaterials.geometryStandardMaterial;
        };
    };
    selectedObjectRef.current = null;
    setSelectedObject(null);
}

export function handleMeshSelect(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
) {
    // Get any newly selected object
    const msh = getSelectedMeshFromMouseClick(event, ray_caster, world)

    // Apply the highlight material to the selected object
    if (msh) {
        msh.material = appMaterials.geometryHighlightMaterial;
    }

    // Remember to set both the React and Three.js state
    setSelectedObject(msh);
    selectedObjectRef.current = msh;
}

function findNearestFaceVertex(faceIndex: any, intersect: any) {
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
    var intersectPoint = new THREE.Vector3();
    intersectPoint.copy(intersect.point);
    intersect.object.worldToLocal(intersectPoint);

    // Build a Triangle for the face
    tp[0].fromBufferAttribute(intersect.object.geometry.attributes.position, faceIndex * 3 + 0);
    tp[1].fromBufferAttribute(intersect.object.geometry.attributes.position, faceIndex * 3 + 1);
    tp[2].fromBufferAttribute(intersect.object.geometry.attributes.position, faceIndex * 3 + 2);
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
    const faceVertex = pos.copy(tp[idx]);
    return intersect.object.localToWorld(faceVertex);
}

function getIntersectionObjectFromMouseClick(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
): THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>> | null {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the ray-cast with the camera and pointer position
    ray_caster.setFromCamera(pointer, world.camera);

    // Find the first (closest to camera) object intersecting the ray-cast
    const intersects = ray_caster.intersectObjects(world.buildingGeometry.children);
    const intersect = intersects.find(intersect => intersect.object instanceof THREE.Mesh) || null;
    return intersect ? intersect : null;
};

export function getNearestFaceVertex(event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup): THREE.Vector3 | null {

    const intersect = getIntersectionObjectFromMouseClick(event, ray_caster, world);
    if (intersect && intersect.object instanceof THREE.Mesh) {
        const faceVertex = findNearestFaceVertex(intersect.faceIndex, intersect);
        return faceVertex;
    };
    return null
}