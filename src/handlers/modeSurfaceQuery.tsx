import '../styles/DimensionLines.css';
import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { handleClearSelectedMesh, handleMeshSelect, getSelectedMeshFromMouseClick } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';

export function surfaceSelectModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
) {
    handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    handleMeshSelect(event, world, selectedObjectRef, setSelectedObject)
}


/// -------- TESTING.....



export function testSelectOnClick(
    event: any,
    world: SceneSetup,
    __sel_objContext: SelectedObjectContextType
) {
    const newMesh = getSelectedMeshFromMouseClick(event, world)
    if (newMesh) {
        if (__sel_objContext.selectedObjectRef.current instanceof THREE.Mesh) {
            __sel_objContext.selectedObjectRef.current.material = appMaterials.geometryStandardMaterial;
        }

        newMesh.material = appMaterials.geometryHighlightMaterial;
        __sel_objContext.selectedObjectRef.current = newMesh
        __sel_objContext.setSelectedObjectState(newMesh)
    }
}