import '../styles/DimensionLines.css';
import { SceneSetup } from '../scene/SceneSetup';
import { getSelectedMeshFromMouseClick } from './selectMesh';
import { appMaterials } from '../scene/Materials';
import { SelectedObjectContextType } from '../contexts/selected_object_context';

export function spacesModeOnMouseClick(
    event: any,
    world: SceneSetup,
    selectedObjectContext: SelectedObjectContextType
) {
    event.preventDefault();
    const newMesh = getSelectedMeshFromMouseClick(event, world.camera, world.spaceGeometryMeshes.children)
    if (newMesh) {
        const newParent = newMesh.parent
        console.log(newParent)
        newMesh.userData["standardMaterial"] = newMesh.material; // Store for changing back later
        newMesh.material = appMaterials.geometryHighlightMaterial;
        selectedObjectContext.selectedObjectRef.current = newMesh
        selectedObjectContext.setSelectedObjectState(newMesh)
    }
}