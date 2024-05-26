import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick, getMeshFromMouseOver } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';
import { HoverObjectContextType } from '../contexts/hover_object_context';


function resetHoverMeshMaterial(object: THREE.Object3D | null) {
    if (object instanceof THREE.Mesh && object.userData["hoverMaterialStore"]) {
        object.userData['hoverOver'] = false;
        if (object.userData['selected'] !== true) {
            object.material = object.userData["hoverMaterialStore"];
        }
    }
}


function resetSelectedMeshMaterial(object: THREE.Object3D | null) {
    if (object instanceof THREE.Mesh && object.userData["selectionMaterialStore"]) {
        object.material = object.userData["selectionMaterialStore"];
        object.userData['selected'] = false;
    }
}


export function surfaceSelectModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectContext: SelectedObjectContextType,
) {
    event.preventDefault();
    const newMesh = getSelectedMeshFromMouseClick(event, world.camera, world.buildingGeometryMeshes.children)
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


export function handleClearSelectedMesh(
    selectedObjectContext: SelectedObjectContextType
) {
    resetSelectedMeshMaterial(selectedObjectContext.selectedObjectRef.current)
    selectedObjectContext.selectedObjectRef.current = null
    selectedObjectContext.setSelectedObjectState(null)
}


export function surfaceSelectModeOnMouseMove(
    e: PointerEvent,
    world: SceneSetup,
    hoverObjectContext: HoverObjectContextType,
    selectedObjectContext: SelectedObjectContextType,
) {
    e.preventDefault();
    const newMesh = getMeshFromMouseOver(e, world.camera, world.buildingGeometryMeshes.children)
    if (newMesh) {
        if (newMesh.userData['selected'] !== true) {
            resetHoverMeshMaterial(hoverObjectContext.hoverObjectRef.current)
            newMesh.userData["hoverMaterialStore"] = newMesh.material; // Store for changing back later
            newMesh.userData['hoverOver'] = true;
            newMesh.material = appMaterials.geometryHoverOver;
            hoverObjectContext.hoverObjectRef.current = newMesh
            hoverObjectContext.setHoverObjectState(newMesh)
        }
    } else {
        resetHoverMeshMaterial(hoverObjectContext.hoverObjectRef.current)
    }
}