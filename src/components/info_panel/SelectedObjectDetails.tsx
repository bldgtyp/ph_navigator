import { useSelectedObjectContext } from '../../contexts/selected_object_context';
import { PipeData } from './PipeData';
import { FaceData } from './ExteriorFaceData';
import { SpaceData } from './SpaceData';
import { SpaceFloorSegmentData } from './SpaceFloorSegmentData';

export function SelectedObjectDetails() {
    const selectedObjectContext = useSelectedObjectContext();
    if (selectedObjectContext.selectedObjectRef.current) {
        console.log(selectedObjectContext.selectedObjectRef.current)
        if (selectedObjectContext.selectedObjectRef.current.userData['type'] == "spaceGroup") {
            return <SpaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "spaceFloorSegmentMeshFace") {
            return <SpaceFloorSegmentData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "faceMesh") {
            return <FaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "apertureMeshFace") {
            return <FaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "pipeSegmentLine") {
            return <PipeData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else { return <></>; }
    }
    else {
        return <></>;
    }
}
