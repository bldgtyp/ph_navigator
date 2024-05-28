import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick, getMeshFromMouseOver } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';
import { HoverObjectContextType } from '../contexts/hover_object_context';


/**
 * Clears the selected space and resets the space group selection material.
 * 
 * @param selectedObjectContext - The context object containing the selected object reference and state.
 */
export function handleClearSelectedSpace(
    selectedObjectContext: SelectedObjectContextType
) {
    resetSpaceGroupSelectionMaterial(selectedObjectContext.selectedObjectRef.current)
    selectedObjectContext.selectedObjectRef.current = null
    selectedObjectContext.setSelectedObjectState(null)
}

/**
 * Resets the hover material of a space group.
 * 
 * @param spaceGroup - The space group to reset the hover material for.
 */
function resetSpaceGroupHoverMaterial(spaceGroup: THREE.Object3D | THREE.Group | null) {
    if (spaceGroup && spaceGroup.userData['selected'] !== true) {
        spaceGroup.children.forEach((spaceMesh: any) => {
            const mat = spaceMesh.userData["hoverMaterialStore"];
            if (mat !== undefined) {
                spaceMesh.material = mat;
            }
        });
    }
}

/**
 * Resets the material of each space mesh in the given space group to its original standard material.
 * 
 * @param spaceGroup - The space group containing the space meshes.
 */
function resetSpaceGroupSelectionMaterial(spaceGroup: THREE.Object3D | THREE.Group | null) {
    spaceGroup?.children.forEach((spaceMesh: any) => {
        spaceGroup.userData['selected'] = false
        const mat = spaceMesh.userData["selectionMaterialStore"];
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
    e: any,
    world: SceneSetup,
    selectedObjectContext: SelectedObjectContextType
) {
    e.preventDefault();
    const newMesh = getSelectedMeshFromMouseClick(e, world.camera, world.spaceGeometryMeshes.children)
    if (newMesh) {
        console.log(newMesh.userData['type'] == "spaceGroup")

        const spaceGroup = newMesh.parent
        if (spaceGroup && spaceGroup instanceof THREE.Group && spaceGroup.userData['selected'] !== true) {
            resetSpaceGroupSelectionMaterial(selectedObjectContext.selectedObjectRef.current)
            resetSpaceGroupHoverMaterial(spaceGroup)
            spaceGroup.userData["selected"] = true;
            spaceGroup.children.forEach((spaceMesh: any) => {
                spaceMesh.userData["selectionMaterialStore"] = spaceMesh.material; // Store for changing back later
                spaceMesh.material = appMaterials.geometrySelected;
            });
        }
        selectedObjectContext.selectedObjectRef.current = spaceGroup
        selectedObjectContext.setSelectedObjectState(spaceGroup)
    }
}



let hoverTimeout: NodeJS.Timeout | null = null;

/**
 * Handles the mouse over event for spaces mode.
 * 
 * @param e - The pointer event.
 * @param world - The scene setup.
 * @param hoverObjectContext - The hover object context.
 */
export function spacesModeOnMouseOver(
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
        const newMesh = getMeshFromMouseOver(e, world.camera, world.spaceGeometryMeshes.children)
        if (newMesh) {
            world.renderer.domElement.style.cursor = 'pointer';
            const spaceGroup = newMesh.parent
            if (spaceGroup && spaceGroup instanceof THREE.Group) {
                if (spaceGroup.userData['selected'] !== true) {
                    resetSpaceGroupHoverMaterial(hoverObjectContext.hoverObjectRef.current)
                    spaceGroup.children.forEach((spaceMesh: any) => {
                        spaceMesh.userData["hoverMaterialStore"] = spaceMesh.material; // Store for changing back later
                        spaceMesh.material = appMaterials.geometryHoverOver;
                    });
                }
            }
            hoverObjectContext.hoverObjectRef.current = spaceGroup
            hoverObjectContext.setHoverObjectState(spaceGroup)
        } else {
            world.renderer.domElement.style.cursor = 'auto';
            resetSpaceGroupHoverMaterial(hoverObjectContext.hoverObjectRef.current)
        }
    }, 10);
}