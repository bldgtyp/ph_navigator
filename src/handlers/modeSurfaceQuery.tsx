import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';

/**
 * Resets the material of a THREE.Mesh object to its original standard material.
 * @param object - The THREE.Object3D or null object whose material needs to be reset.
 */
function resetMeshMaterial(object: THREE.Object3D | null) {
    if (object instanceof THREE.Mesh) {
        const mat = object.userData["standardMaterial"];
        if (mat !== undefined) {
            object.material = mat;
        }
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
    event.preventDefault();
    const newMesh = getSelectedMeshFromMouseClick(event, world.camera, world.buildingGeometryMeshes.children)
    if (newMesh) {
        resetMeshMaterial(selectedObjectContext.selectedObjectRef.current)
        newMesh.userData["standardMaterial"] = newMesh.material; // Store for changing back later
        newMesh.material = appMaterials.geometryHighlight;
        selectedObjectContext.selectedObjectRef.current = newMesh
        selectedObjectContext.setSelectedObjectState(newMesh)
    }
}


/**
 * Clears the selected mesh and resets its material.
 *
 * @param selectedObjectContext - The context object containing the selected mesh and its state.
 */
export function handleClearSelectedMesh(
    selectedObjectContext: SelectedObjectContextType
) {
    resetMeshMaterial(selectedObjectContext.selectedObjectRef.current)
    selectedObjectContext.selectedObjectRef.current = null
    selectedObjectContext.setSelectedObjectState(null)
}