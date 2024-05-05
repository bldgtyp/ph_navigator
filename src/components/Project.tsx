// A Single Project's PH-Nav View

import * as THREE from 'three';
import React, { useRef, useState, useReducer } from 'react';
import Viewer from './Viewer';
import FacesPanel from './FaceDataPanel';
import AppStateMenubar from './AppStateMenubar';
import { AppState, states } from './AppState';
import { SceneSetup } from '../scene/SceneSetup';


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Setup the Project's View State
const setAppStateReducer = (_appState: AppState, _appStateNumber: number) => {
    return states[_appStateNumber]
}
type AppStateContextType = { appState: AppState, dispatch: React.Dispatch<number> }
const defaultAppState = { appState: states[0], dispatch: () => 0 }
export const AppStateContext = React.createContext<AppStateContextType>(defaultAppState)

function Project() {
    const world = useRef(new SceneSetup());
    const [_appState, _appStateDispatch] = useReducer(setAppStateReducer, states[0])
    const [selectedObject, setSelectedObject] = useState<any>(null); // For React Rendering
    const selectedObjectRef = useRef<THREE.Object3D | null>(null); // For THREE.js Rendering
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering
    world.current.scene.add(dimensionLinesRef.current);

    return (
        <AppStateContext.Provider value={{ appState: _appState, dispatch: _appStateDispatch }}>
            <Viewer
                world={world}
                selectedObjectRef={selectedObjectRef}
                setSelectedObject={setSelectedObject}
                hoveringVertex={hoveringVertex}
                dimensionLinesRef={dimensionLinesRef}
            />
            <FacesPanel selectedObject={selectedObject} />
            <AppStateMenubar />
        </AppStateContext.Provider>
    );
}

export default Project;