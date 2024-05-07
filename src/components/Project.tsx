// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef, useState } from 'react';
import Viewer from './Viewer';
import FacesPanel from './FaceDataPanel';
import AppStateMenubar from './AppStateMenubar';
import ResultsSidebar from './ResultsSidebar';
import { SceneSetup } from '../scene/SceneSetup';
import { AppStateContextProvider } from '../contexts/app_state_context';


function Project() {
    const world = useRef(new SceneSetup());
    const [selectedObject, setSelectedObject] = useState<any>(null); // For React Rendering
    const selectedObjectRef = useRef<THREE.Object3D | null>(null); // For THREE.js Rendering
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering

    world.current.scene.add(dimensionLinesRef.current);

    return (
        <AppStateContextProvider>
            <Viewer
                world={world}
                selectedObjectRef={selectedObjectRef}
                setSelectedObject={setSelectedObject}
                hoveringVertex={hoveringVertex}
                dimensionLinesRef={dimensionLinesRef}
            />
            <FacesPanel selectedObject={selectedObject} />
            <AppStateMenubar />
            <ResultsSidebar />
        </AppStateContextProvider>
    );
}

export default Project;