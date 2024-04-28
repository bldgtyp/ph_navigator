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
    const intersects = ray_caster.intersectObjects(world.scene.children);
    const mesh = intersects.find(intersect => intersect.object instanceof THREE.Mesh) || null;
    return mesh ? mesh.object as THREE.Mesh : null;
};

function handleClearSelectedMesh(
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
) {
    if (selectedObjectRef && selectedObjectRef.current instanceof THREE.Mesh) {
        selectedObjectRef.current.material = appMaterials.geometryStandardMaterial;
    }
    selectedObjectRef.current = null;
    setSelectedObject(null);
}

function handleMeshSelect(
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

function getSelectedVertexFromMouseClick() {
    console.log("Getting Vertex...")
    // https://sbcode.net/threejs/measurements/
}

function handleMeasureDistance() {
}


export function onMouseClick(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
    appState: React.MutableRefObject<number | null>,
) {
    if (appState.current === 0) {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        handleMeshSelect(event, ray_caster, world, selectedObjectRef, setSelectedObject)
    } else if (appState.current === 1) {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        handleMeasureDistance()
    } else if (appState.current === 2) {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    } else {
        console.log("No action defined for the current app state")
    }
}