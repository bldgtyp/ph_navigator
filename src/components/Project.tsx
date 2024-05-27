// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { Route, Routes, useParams, useNavigate } from "react-router-dom";

import AppStateMenubar from './VizStateMenubar';
import Model from './Model';
import NavigationBar from './NavigationBar';
import UploadModelDialog from './UploadModelDialog';
import Viewer from './Viewer';
import { SceneSetup } from '../scene/SceneSetup';
import { AppStateContextProvider } from '../contexts/app_viz_state_context';
import { AppToolStateContextProvider } from '../contexts/app_tool_state_context';
import { SelectedObjectContextProvider } from '../contexts/selected_object_context';
import { HoverObjectContextProvider } from '../contexts/hover_object_context';
import { ModelView } from "../types/fake_database/ModelView";
import { getProjectModelViews, getModelView } from "../api/project";


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
        async function loadModelViews() {
            // -- Load all of the Project's Model Views
            const projectModelViews = await getProjectModelViews(teamId, projectId);
            if (!projectModelViews) {
                alert(`Project ${projectId} has no model views to load.`);
                return;
            } else {
                setModelViewList(projectModelViews);
            }

            // -- Load the First Model View
            if (projectModelViews.length > 0) {
                const modelId = projectModelViews[0].display_name; // Default to the first model
                const modelView = await getModelView(teamId, projectId, modelId);
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
        }

        loadModelViews();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId, projectId]);


    return (
        <>
            <NavigationBar modelsViewList={modelViewList} />
            <AppStateContextProvider>
                <AppToolStateContextProvider>
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
                </AppToolStateContextProvider>
            </AppStateContextProvider>
        </>
    );
}

export default Project;