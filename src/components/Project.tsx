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
import { HoverObjectContextProvider } from '../contexts/hover_object_context';
import NavigationBar from './NavigationBar';
import { fetchModelServer } from "../hooks/fetchModelServer";
import { ModelView } from "../types/fake_database/ModelView";



async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}): Promise<T | null> {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`;
        alert(message);
        return null;
    } else {
        return data;
    }
}


async function fetchProjectModelViews(teamId: string, projectId: string): Promise<ModelView[] | null> {
    return fetchWithModal<ModelView[]>(`${teamId}/${projectId}/get_models`);
}

async function fetchModelView(teamId: string, projectId: string, modelId: string): Promise<ModelView | null> {
    return fetchWithModal<ModelView>(`${teamId}/${projectId}/get_model`, "", { model_name: `${modelId}` });
}


function Project() {
    const navigate = useNavigate();
    const { teamId, projectId } = useParams();
    const [modelViewList, setModelViewList] = useState<ModelView[]>([]);
    const [showUploadModel, setShowUploadModel] = useState(false);
    const [showModel, setShowModel] = useState(false);
    const world = useRef(new SceneSetup());
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering
    world.current.scene.add(dimensionLinesRef.current);

    useEffect(() => {
        const loadModelViews = async () => {
            if (teamId === undefined || projectId === undefined) { return; }

            const projectModelViews = await fetchProjectModelViews(teamId, projectId);

            if (!projectModelViews) { return; }

            setModelViewList(projectModelViews);

            if (projectModelViews.length > 0) {
                const modelId = projectModelViews[0].display_name; // Default to the first model
                const modelView = await fetchModelView(teamId, projectId, modelId);

                if (!modelView) { return; }

                if (modelView.hbjson_url === "" || modelView.hbjson_url === null) {
                    setShowUploadModel(true);
                } else {
                    setShowModel(true);
                    navigate(`/${teamId}/${projectId}/${modelId}`);
                }
            } else {
                setShowUploadModel(true);
            }
        };

        loadModelViews();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId, projectId]);


    return (
        <>
            <NavigationBar modelsViewList={modelViewList} />
            <AppStateContextProvider>
                <SelectedObjectContextProvider>
                    <HoverObjectContextProvider>
                        <Viewer
                            world={world}
                            hoveringVertex={hoveringVertex}
                            dimensionLinesRef={dimensionLinesRef}
                        />
                        {showUploadModel ? <UploadModelDialog setModelViewList={setModelViewList} setShowModel={setShowModel} /> : null}
                        <Routes>
                            <Route path="/" element={<Model world={world} showModel={showModel} />} />
                            <Route path=":modelId/" element={<Model world={world} showModel={showModel} />} />
                        </Routes>
                    </HoverObjectContextProvider>
                </SelectedObjectContextProvider>
                <AppStateMenubar />
            </AppStateContextProvider>
        </>
    );
}

export default Project;