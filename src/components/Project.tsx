// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { Route, Routes, useParams, useNavigate } from "react-router-dom";

import Viewer from './Viewer';
import AppStateMenubar from './AppStateMenubar';
import UploadModelDialog from './UploadModelDialog';
import { Model } from './Model';
import { SceneSetup } from '../scene/SceneSetup';
import { AppStateContextProvider } from '../contexts/app_state_context';
import { SelectedObjectContextProvider } from '../contexts/selected_object_context';
import NavigationBar from './NavigationBar';
import { fetchModelServer } from "../hooks/fetchModelServer";
import { ModelView } from "../types/fake_database/ModelView";

async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`
        alert(message);
        return null;
    } else {
        return data;
    }
};

function Project() {
    const navigate = useNavigate();
    const { teamId, projectId } = useParams();
    const [modelNames, setModelNames] = useState<string[] | undefined>(undefined);
    const [showUploadModel, setShowUploadModel] = useState(false);
    const [showModel, setShowModel] = useState(false);

    const world = useRef(new SceneSetup());
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering

    world.current.scene.add(dimensionLinesRef.current);

    // Load in the ModelViews for the Project
    useEffect(() => {
        fetchWithModal<string[]>(`${teamId}/${projectId}/get_model_names`)
            .then(projectModelNames => {
                if (!projectModelNames) { return null }

                setModelNames(projectModelNames);

                // If the Project has any ModelViews...
                if (projectModelNames.length > 0) {

                    const modelId = projectModelNames[0];
                    fetchWithModal<ModelView>(`${teamId}/${projectId}/get_model`, "", { model_name: `${modelId}` })
                        .then(modelView => {
                            if (!modelView) { return null }

                            // If the ModelView is missing a source-URL, ask the user to upload a model
                            if (modelView.hbjson_url === "" || modelView.hbjson_url === null) {
                                setShowUploadModel(true);
                                return;
                            } else {
                                /// If the ModelView has a source-URL, show the model...
                                setShowModel(true);
                                navigate(`/${teamId}/${projectId}/${modelId}`);
                            }
                        });
                } else {
                    // If the project has no ModelViews, ask the user to upload a model...
                    setShowUploadModel(true);
                    return;
                }
            });
    }, [teamId, projectId]);

    return (
        <>
            <NavigationBar modelsList={modelNames} />
            <AppStateContextProvider>
                <SelectedObjectContextProvider>
                    <Viewer
                        world={world}
                        hoveringVertex={hoveringVertex}
                        dimensionLinesRef={dimensionLinesRef}
                    />
                    {showUploadModel ? <UploadModelDialog setModelNames={setModelNames} setShowModel={setShowModel} /> : null}
                    <Routes>
                        <Route path="/" element={<Model world={world} showModel={showModel} />} />
                        <Route path=":modelId/" element={<Model world={world} showModel={showModel} />} />
                    </Routes>
                </SelectedObjectContextProvider>
                <AppStateMenubar />
            </AppStateContextProvider>
        </>
    );
}

export default Project;