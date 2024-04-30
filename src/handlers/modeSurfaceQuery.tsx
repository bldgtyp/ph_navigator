import '../styles/DimensionLines.css';
import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { handleClearSelectedMesh, handleMeshSelect } from './selectMesh';

export function surfaceSelectModeOnMouseClick(
    event: any,
    ray_caster: THREE.Raycaster,
    world: SceneSetup,
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
) {
    handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    handleMeshSelect(event, ray_caster, world, selectedObjectRef, setSelectedObject)
}