// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { Route, Routes, useParams } from "react-router-dom";
import Viewer from './Viewer';
import InfoPanel from './InfoPanel';
import AppStateMenubar from './AppStateMenubar';
import ResultsSidebar from './ResultsSidebar';
import UploadModelDialog from './UploadModelDialog';
import { SceneSetup } from '../scene/SceneSetup';
import { AppStateContextProvider } from '../contexts/app_state_context';
import { SelectedObjectContextProvider } from '../contexts/selected_object_context';
import { Model } from './Model';
import NavigationBar from './NavigationBar';
import { fetchModelServer } from "../hooks/fetchModelServer";
import { useNavigate } from "react-router-dom";

function Project() {
    const navigate = useNavigate();
    const { teamId, projectId } = useParams();
    const [models, setModels] = useState<string[] | undefined>(undefined);
    const [showUploadModel, setShowUploadModel] = useState(false);

    const world = useRef(new SceneSetup());
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering

    world.current.scene.add(dimensionLinesRef.current);

    // Get the project's model names list
    useEffect(() => {
        fetchModelServer<string[]>(`${teamId}/${projectId}/get_model_names`).then(data => {
            setModels(data);
            if (data.length > 0) {
                navigate(`/${teamId}/${projectId}/${data[0]}`);
            } else {
                setShowUploadModel(true);
            }
        });
    }, [teamId, projectId]);

    return (
        <>
            <NavigationBar modelsList={models} />
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
                {showUploadModel ? <UploadModelDialog /> : null}
            </AppStateContextProvider>
        </>
    );
}

export default Project;