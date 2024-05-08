import '../styles/DimensionLines.css';
import { SceneSetup } from '../scene/SceneSetup';
import * as THREE from 'three';
import { appMaterials } from '../scene/Materials';

export function getSelectedMeshFromMouseClick(
    event: any,
    world: SceneSetup,
): THREE.Mesh | null {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    const pointer = new THREE.Vector2();
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    const ray_caster = new THREE.Raycaster();
    ray_caster.setFromCamera(pointer, world.camera);

    // Find the First (closets to camera) object intersecting the picking ray
    const intersects = ray_caster.intersectObjects(world.buildingGeometryMeshes.children);
    const mesh = intersects.find(intersect => intersect.object instanceof THREE.Mesh) || null;
    return mesh ? mesh.object as THREE.Mesh : null;
}

export function handleClearSelectedMesh(
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
) {
    if (selectedObjectRef && selectedObjectRef.current instanceof THREE.Mesh) {
        if ((selectedObjectRef.current as THREE.Mesh).userData["face_type"] == "Aperture") {
            selectedObjectRef.current.material = appMaterials.geometryWindowMaterial;
        } else {
            selectedObjectRef.current.material = appMaterials.geometryStandardMaterial;
        }
    }
    selectedObjectRef.current = null;
    setSelectedObject(null);
}