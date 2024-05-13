// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef } from 'react';
import Viewer from './Viewer';
import InfoPanel from './InfoPanel';
import AppStateMenubar from './AppStateMenubar';
import ResultsSidebar from './ResultsSidebar';
import { SceneSetup } from '../scene/SceneSetup';
import { AppStateContextProvider } from '../contexts/app_state_context';
import { SelectedObjectContextProvider } from '../contexts/selected_object_context';
import { Model } from './Model';
import { Route, Routes } from "react-router-dom";
import NavigationBar from './NavigationBar';

function Project() {
    const world = useRef(new SceneSetup());
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering

    world.current.scene.add(dimensionLinesRef.current);

    return (
        <>
            <NavigationBar />
            <AppStateContextProvider>
                <SelectedObjectContextProvider>
                    <Viewer
                        world={world}
                        hoveringVertex={hoveringVertex}
                        dimensionLinesRef={dimensionLinesRef}
                    />
                    <InfoPanel />
                    <Routes>
                        <Route path="/" element={<Model world={world} />} />
                        <Route path=":modelId/" element={<Model world={world} />} />
                    </Routes>
                </SelectedObjectContextProvider>
                <AppStateMenubar />
                <ResultsSidebar />
            </AppStateContextProvider>
        </>
    );
}

export default Project;