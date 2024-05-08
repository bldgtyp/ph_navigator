import '../styles/DimensionLines.css';
import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';


function resetMeshMaterial(object: THREE.Object3D | null) {
    if (object instanceof THREE.Mesh) {
        object.material = object.userData["standardMaterial"];
    }
}

/**
 * Handles the surface select mode on mouse click event.
 *
 * @param event - The mouse click event.
 * @param world - The scene setup.
 * @param selectedObjectContext - The selected object context.
 */
export function surfaceSelectModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectContext: SelectedObjectContextType
) {
    const newMesh = getSelectedMeshFromMouseClick(event, world)
    if (newMesh) {
        resetMeshMaterial(selectedObjectContext.selectedObjectRef.current)
        newMesh.userData["standardMaterial"] = newMesh.material; // Store for changing back later
        newMesh.material = appMaterials.geometryHighlightMaterial;
        selectedObjectContext.selectedObjectRef.current = newMesh
        selectedObjectContext.setSelectedObjectState(newMesh)
    }
}

export function handleClearSelectedMesh(
    selectedObjectContext: SelectedObjectContextType
) {
    resetMeshMaterial(selectedObjectContext.selectedObjectRef.current)
    selectedObjectContext.selectedObjectRef.current = null
    selectedObjectContext.setSelectedObjectState(null)
}