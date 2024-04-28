import '../styles/DimensionLines.css';
import { SceneSetup } from '../scene/SceneSetup';
import * as THREE from 'three';
import { appMaterials } from '../scene/Materials';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

const dimensionLines = new THREE.Group();
dimensionLines.renderOrder = 1;
var selectedVertices: THREE.Vector3[] = [];
var drawingLine = false;
var marker = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), new THREE.MeshBasicMaterial({
    color: 0xe600e6
}));
marker.position.setScalar(1000);


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

function handleMeasureDistance(
    dimensionLines: any,
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>,
    world: SceneSetup,
) {
    if (hoveringVertex.current === null) {
        return null
    }

    if (selectedVertices.length === 0) {
        drawingLine = true;
        selectedVertices[0] = hoveringVertex.current
        dimensionLines.add(marker);
        marker.position.copy(hoveringVertex.current);
    } else if (selectedVertices.length === 1) {
        selectedVertices[1] = hoveringVertex.current
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(selectedVertices),
            appMaterials.dimensionLineMaterial
        );
        line.frustumCulled = false;
        line.renderOrder = 1;
        dimensionLines.add(line);

        // Build the Label
        const measurementDiv = document.createElement(
            'div'
        ) as HTMLDivElement
        measurementDiv.className = 'dimension-label'
        measurementDiv.innerText = '0.0'
        const measurementLabel = new CSS2DObject(measurementDiv)
        measurementLabel.position.copy(selectedVertices[0])

        // Store the line and label
        line.geometry.attributes.position.needsUpdate = true
        const distance = selectedVertices[0].distanceTo(selectedVertices[1])
        measurementLabel.element.innerText = distance.toFixed(2)
        measurementLabel.position.lerpVectors(selectedVertices[0], selectedVertices[1], 0.5)

        // Cleanup
        dimensionLines.add(measurementLabel)
        selectedVertices = [];
        drawingLine = false;
    }
}

export function onMouseClick(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
    appState: React.MutableRefObject<number | null>,
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>,
) {
    if (appState.current === 0) {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        handleMeshSelect(event, ray_caster, world, selectedObjectRef, setSelectedObject)
        dimensionLines.clear();
        selectedVertices = [];
    } else if (appState.current === 1) {
        world.scene.add(dimensionLines);
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        handleMeasureDistance(dimensionLines, hoveringVertex, world)
    } else if (appState.current === 2) {
        dimensionLines.clear();
        selectedVertices = [];
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    } else {
        dimensionLines.clear();
        selectedVertices = [];
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        console.log("No action defined for the current app state")
    }
}