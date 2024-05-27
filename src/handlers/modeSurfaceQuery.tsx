import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick, getMeshFromMouseOver } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';
import { HoverObjectContextType } from '../contexts/hover_object_context';


/**
 * Resets the hover mesh material for the given object.
 * If the object is a mesh and has a stored hover material, it sets the object's material to the stored hover material.
 * It also sets the 'hoverOver' property of the object to false.
 * If the object is not selected, it restores the original material.
 * 
 * @param object - The object to reset the hover mesh material for.
 */
function resetHoverMeshMaterial(object: THREE.Object3D | null) {
    if (object instanceof THREE.Mesh && object.userData["hoverMaterialStore"]) {
        if (object.userData['selected'] !== true) {
            object.material = object.userData["hoverMaterialStore"];
        }
    }
}


/**
 * Resets the material and selection state of a selected mesh object.
 * 
 * @param object - The mesh object to reset.
 */
function resetSelectedMeshMaterial(object: THREE.Object3D | null) {
    if (object instanceof THREE.Mesh && object.userData["selectionMaterialStore"]) {
        object.material = object.userData["selectionMaterialStore"];
        object.userData['selected'] = false;
    }
}


/**
 * Handles the surface select mode on mouse click event.
 *
 * @param event - The mouse click event.
 * @param world - The scene setup object.
 * @param selectedObjectContext - The selected object context object.
 */
export function surfaceSelectModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectContext: SelectedObjectContextType,
) {
    event.preventDefault();
    const newMesh = getSelectedMeshFromMouseClick(event, world.camera, world.selectableObjects.children)
    if (newMesh) {
        resetSelectedMeshMaterial(selectedObjectContext.selectedObjectRef.current)
        resetHoverMeshMaterial(newMesh)
        newMesh.userData["selectionMaterialStore"] = newMesh.material; // Store for changing back later
        newMesh.userData["selected"] = true;
        newMesh.material = appMaterials.geometrySelected;
        selectedObjectContext.selectedObjectRef.current = newMesh
        selectedObjectContext.setSelectedObjectState(newMesh)
    }
}


/**
 * Clears the selected mesh and resets its material.
 *
 * @param selectedObjectContext - The context object containing the selected object and its state.
 */
export function handleClearSelectedMesh(
    selectedObjectContext: SelectedObjectContextType
) {
    resetSelectedMeshMaterial(selectedObjectContext.selectedObjectRef.current)
    selectedObjectContext.selectedObjectRef.current = null
    selectedObjectContext.setSelectedObjectState(null)
}

let hoverTimeout: NodeJS.Timeout | null = null;

/**
 * Handles the mouse over event for surface selection mode.
 * 
 * @param e - The pointer event.
 * @param world - The scene setup.
 * @param hoverObjectContext - The hover object context.
 */
export function surfaceSelectModeOnMouseOver(
    e: PointerEvent,
    world: SceneSetup,
    hoverObjectContext: HoverObjectContextType,
) {
    e.preventDefault();
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
    }

    hoverTimeout = setTimeout(() => {

        const newMesh = getMeshFromMouseOver(e, world.camera, world.selectableObjects.children)
        if (newMesh) {
            world.renderer.domElement.style.cursor = 'pointer';
            if (newMesh.userData['selected'] !== true) {
                resetHoverMeshMaterial(hoverObjectContext.hoverObjectRef.current)
                newMesh.userData["hoverMaterialStore"] = newMesh.material; // Store for changing back later
                newMesh.material = appMaterials.geometryHoverOver;
                hoverObjectContext.hoverObjectRef.current = newMesh
                hoverObjectContext.setHoverObjectState(newMesh)
            }
        } else {
            world.renderer.domElement.style.cursor = 'auto';
            resetHoverMeshMaterial(hoverObjectContext.hoverObjectRef.current)
        }
    }, 10);
}