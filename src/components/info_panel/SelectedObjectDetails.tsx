import { useSelectedObjectContext } from '../../contexts/selected_object_context';
import { PipeData } from './PipeData';
import { FaceData } from './FaceData';
import { SpaceData } from './SpaceData';

export function SelectedObjectDetails() {
    const selectedObjectContext = useSelectedObjectContext();
    if (selectedObjectContext.selectedObjectRef.current) {
        if (selectedObjectContext.selectedObjectRef.current.userData['type'] == "spaceGroup") {
            return <SpaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
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
