// A Single Project's PH-Navigator Instance

import * as THREE from 'three';
import { useRef, useEffect, useState } from 'react';
import { Route, Routes, useParams, useNavigate } from "react-router-dom";
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

type ModelView = {
    identifier: string;
    display_name: string;
    hbjson_url: string;
    has_hb_model: boolean;
}

function Project() {
    const navigate = useNavigate();
    const { teamId, projectId } = useParams();
    const [modelNames, setModelNames] = useState<string[] | undefined>(undefined);
    const [showUploadModel, setShowUploadModel] = useState(false);

    const world = useRef(new SceneSetup());
    const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering
    const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering

    world.current.scene.add(dimensionLinesRef.current);

    useEffect(() => {
        fetchModelServer<string[]>(`${teamId}/${projectId}/get_model_names`).then(projectModelNames => {
            console.log(`${teamId}/${projectId}`, projectModelNames)
            setModelNames(projectModelNames);
            if (projectModelNames.length > 0) {
                const modelId = projectModelNames[0];
                fetchModelServer<ModelView>(`${teamId}/${projectId}/get_model`, "", { model_name: `${modelId}` })
                    .then(modelView => {
                        if (modelView.hbjson_url === "" || modelView.hbjson_url === null) {
                            setShowUploadModel(true);
                            return;
                        } else {
                            navigate(`/${teamId}/${projectId}/${modelId}`);
                        }
                    });
            } else {
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
                    <InfoPanel />
                    <Routes>
                        <Route path="/" element={<Model world={world} />} />
                        <Route path=":modelId/" element={<Model world={world} />} />
                    </Routes>
                </SelectedObjectContextProvider>
                <AppStateMenubar />
                <ResultsSidebar />
                {showUploadModel ? <UploadModelDialog setModelNames={setModelNames} /> : null}
            </AppStateContextProvider>
        </>
    );
}

export default Project;