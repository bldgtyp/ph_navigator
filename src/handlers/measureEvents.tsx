import '../styles/DimensionLines.css';
import { SceneSetup } from '../scene/SceneSetup';
import * as THREE from 'three';
import { appMaterials } from '../scene/Materials';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { handleClearSelectedMesh } from './meshSelection';

const dimensionLines = new THREE.Group();
dimensionLines.renderOrder = 1;
var selectedVertices: THREE.Vector3[] = [];
var drawingLine = false;
var marker = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 12), new THREE.MeshBasicMaterial({
    color: 0xe600e6
}));
marker.position.setScalar(1000);

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
        measurementLabel.element.innerText = distance.toFixed(2) + "m"
        measurementLabel.position.lerpVectors(selectedVertices[0], selectedVertices[1], 0.5)

        // Cleanup
        dimensionLines.add(measurementLabel)
        selectedVertices = [];
        drawingLine = false;
    }
}

export function measureModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>,
) {
    world.scene.add(dimensionLines);
    handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    // handleMeasureDistance(dimensionLines, hoveringVertex, world)
}