// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef } from 'react';
import Viewer from './Viewer';
import FacesPanel from './FaceDataPanel';
import AppStateMenubar from './AppStateMenubar';
import ResultsSidebar from './ResultsSidebar';
import { SceneSetup } from '../scene/SceneSetup';
import { AppStateContextProvider } from '../contexts/app_state_context';
import { SelectedObjectContextProvider } from '../contexts/selected_object_context';

function Project() {
    const world = useRef(new SceneSetup());
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering

    world.current.scene.add(dimensionLinesRef.current);

    return (
        <AppStateContextProvider>
            <SelectedObjectContextProvider>
                <Viewer
                    world={world}
                    hoveringVertex={hoveringVertex}
                    dimensionLinesRef={dimensionLinesRef}
                />
                <FacesPanel />
            </SelectedObjectContextProvider>
            <AppStateMenubar />
            <ResultsSidebar />
        </AppStateContextProvider>
    );
}

export default Project;