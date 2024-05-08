import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';

/**
 * Resets the material of each space mesh in the given space group to its original standard material.
 * 
 * @param spaceGroup - The space group containing the space meshes.
 */
function resetSpaceGroupMaterial(spaceGroup: THREE.Object3D | THREE.Group | null) {
    spaceGroup?.children.forEach((spaceMesh: any) => {
        const mat = spaceMesh.userData["standardMaterial"];
        if (mat !== undefined) {
            spaceMesh.material = mat;
        }
    });
}

/**
 * Handles the mouse click event for the spaces mode.
 * 
 * @param {any} event - The mouse click event.
 * @param {SceneSetup} world - The scene setup object.
 * @param {SelectedObjectContextType} selectedObjectContext - The selected object context.
 */
export function spacesModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectContext: SelectedObjectContextType
) {
    event.preventDefault();
    const newMesh = getSelectedMeshFromMouseClick(event, world.camera, world.spaceGeometryMeshes.children)
    if (newMesh) {
        const spaceGroup = newMesh.parent
        if (spaceGroup && spaceGroup instanceof THREE.Group) {
            resetSpaceGroupMaterial(selectedObjectContext.selectedObjectRef.current)
            spaceGroup.children.forEach((spaceMesh: any) => {
                spaceMesh.userData["standardMaterial"] = spaceMesh.material; // Store for changing back later
                spaceMesh.material = appMaterials.geometryHighlightMaterial;
            });
        }
        selectedObjectContext.selectedObjectRef.current = spaceGroup
        selectedObjectContext.setSelectedObjectState(spaceGroup)
    }
}

/**
 * Clears the selected space and resets its group material.
 *
 * @param selectedObjectContext - The context object containing the selected object reference and state.
 */
export function handleClearSelectedSpace(
    selectedObjectContext: SelectedObjectContextType
) {
    resetSpaceGroupMaterial(selectedObjectContext.selectedObjectRef.current)
    selectedObjectContext.selectedObjectRef.current = null
    selectedObjectContext.setSelectedObjectState(null)
}