// 3D-Geometry and Views of a Specific Model Instance
import "../styles/Model.css";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { SceneSetup } from '../scene/SceneSetup';
import InfoPanel from './InfoPanel';
import ResultsSidebar from './ResultsSidebar';
import { Dialog } from '@mui/material';
import MoonLoader from "react-spinners/MoonLoader";

import { fetchModelServer } from "../hooks/fetchModelServer";
import { loadModelFaces } from '../loaders/load_model_faces';
import { loadModelSpaces } from '../loaders/load_model_spaces';
import { loadModelSunPath } from '../loaders/load_sun_path';
import { loadModelHotWaterPiping } from '../loaders/load_hot_water_piping';
import { loadModelERVDucting } from '../loaders/load_erv_ducting';
import { loadModelShades } from '../loaders/load_model_shades';

import { hbFace } from "../types/honeybee/face";
import { hbPHSpace } from "../types/honeybee_ph/space";
import { lbtSunPathDTO } from "../types/ladybug/sunpath";
import { hbPhHvacHotWaterSystem } from "../types/honeybee_phhvac/hot_water_system";
import { hbPhHvacVentilationSystem } from "../types/honeybee_phhvac/ventilation";
import { hbShadeGroup } from "../types/honeybee/shade";


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

type ModelProps = {
    world: React.MutableRefObject<SceneSetup>;
    showModel: boolean;
};

function handleError<T>(_func: any, world: React.MutableRefObject<SceneSetup>, data: T[] | null) {
    if (!data) {
        return [];
    } else if (Array.isArray(data)) {
        return _func(world, data);
    }
};

export function Model(props: ModelProps) {
    console.log("Rendering Model Component...")
    const { world, showModel } = props;
    const { teamId, projectId, modelId } = useParams();
    const [isLoading, setIsLoading] = useState(true);


    // Load the Model-Elements from the Server based on: team-id / project-id / model-id
    // ------------------------------------------------------------------------
    useEffect(() => {
        console.log("Loading Model Elements...")
        setIsLoading(true);
        world.current.reset();
        if (showModel === true && modelId !== undefined && projectId !== undefined) {

            fetchWithModal<hbFace[]>(`${teamId}/${projectId}/${modelId}/load_hb_model`)
                .then(data => {
                    if (!data) { return null }

                    fetchWithModal<hbFace[]>(`${teamId}/${projectId}/${modelId}/faces`)
                        .then(data => handleError(loadModelFaces, world, data))

                    fetchWithModal<hbPHSpace[]>(`${teamId}/${projectId}/${modelId}/spaces`)
                        .then(data => handleError(loadModelSpaces, world, data));

                    fetchWithModal<lbtSunPathDTO[]>(`${teamId}/${projectId}/${modelId}/sun_path`)
                        .then(data => handleError(loadModelSunPath, world, data));

                    fetchWithModal<hbPhHvacHotWaterSystem[]>(`${teamId}/${projectId}/${modelId}/hot_water_systems`)
                        .then(data => handleError(loadModelHotWaterPiping, world, data));

                    fetchWithModal<hbPhHvacVentilationSystem[]>(`${teamId}/${projectId}/${modelId}/ventilation_systems`)
                        .then(data => handleError(loadModelERVDucting, world, data));

                    return fetchWithModal<hbShadeGroup[]>(`${teamId}/${projectId}/${modelId}/shading_elements`)
                        .then(data => handleError(loadModelShades, world, data));
                })
                .then(() => {
                    setIsLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId, projectId, modelId, showModel]);

    return (
        <>
            {isLoading && (
                <Dialog className="model-loading" open={isLoading}>
                    <div className="model-loading">
                        <div>Please wait while the model is loaded.</div>
                        <div>For large models this may take some time to download.</div>
                        <MoonLoader
                            color="#1976d2"
                            cssOverride={{
                                display: "block",
                                margin: "0 auto",
                                padding: "8px",
                            }}
                            size="25px"
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </Dialog>)
            }
            <ResultsSidebar />
            <InfoPanel />
        </>)
}