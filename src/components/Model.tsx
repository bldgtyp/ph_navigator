// 3D-Geometry and Views of a Specific Model Instance
import "../styles/Model.css";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { SceneSetup } from '../scene/SceneSetup';
import InfoPanel from './InfoPanel';
// import ResultsSidebar from './ResultsSidebar';
// import { _AO_GUI_ } from './_AO_GUI_';
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

/**
 * Fetches data from the model server with a modal for errors.
 *
 * @param endpoint - The endpoint to fetch data from.
 * @param token - The authentication token (optional).
 * @param params - Additional parameters for the request (optional).
 * @returns A Promise that resolves to the fetched data or null if there was an error.
 */
async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`
        alert(message);
        return null;
    } else {
        return data;
    }
}

type ModelProps = {
    world: React.MutableRefObject<SceneSetup>;
    showModel: boolean;
};

/**
 * Handles errors in the specified function.
 * 
 * @template T - The type of data being handled.
 * @param _func - The function to handle errors for.
 * @param world - A mutable ref object containing the scene setup.
 * @param data - The data to be processed by the function.
 * @returns An array of results from the function, or an empty array if there was an error or the data is null.
 */
function handleError<T>(_func: any, world: React.MutableRefObject<SceneSetup>, data: T[] | null) {
    if (!data) {
        return [];
    } else if (Array.isArray(data)) {
        return _func(world, data);
    }
}

export function Model(props: ModelProps) {
    console.log("Rendering Model Component...")
    const { world, showModel } = props;
    const { teamId, projectId, modelId } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    // Load the Model-Elements from the Server based on: team-id / project-id / model-id
    // ------------------------------------------------------------------------
    useEffect(() => {
        async function fetchModelDataFromServer() {
            try {
                console.log(`Loading data for ${teamId}/${projectId}/${modelId}`)
                const routeLoadModel = `${teamId}/${projectId}/${modelId}/load_hb_model`;
                const modelData = await fetchWithModal<hbFace[]>(routeLoadModel);
                if (!modelData) { return null }

                const routeFaces = `${teamId}/${projectId}/${modelId}/faces`;
                const facesData = await fetchWithModal<hbFace[]>(routeFaces);
                handleError(loadModelFaces, world, facesData);

                const routeSpaces = `${teamId}/${projectId}/${modelId}/spaces`;
                const spacesData = await fetchWithModal<hbPHSpace[]>(routeSpaces);
                handleError(loadModelSpaces, world, spacesData);

                const routeSunPath = `${teamId}/${projectId}/${modelId}/sun_path`;
                const sunPathData = await fetchWithModal<lbtSunPathDTO[]>(routeSunPath);
                handleError(loadModelSunPath, world, sunPathData);

                const routeHotWaterSystem = `${teamId}/${projectId}/${modelId}/hot_water_systems`;
                const hotWaterSystemData = await fetchWithModal<hbPhHvacHotWaterSystem[]>(routeHotWaterSystem);
                handleError(loadModelHotWaterPiping, world, hotWaterSystemData);

                const routeVentilationSystem = `${teamId}/${projectId}/${modelId}/ventilation_systems`;
                const ventilationSystemData = await fetchWithModal<hbPhHvacVentilationSystem[]>(routeVentilationSystem);
                handleError(loadModelERVDucting, world, ventilationSystemData);

                const routeShades = `${teamId}/${projectId}/${modelId}/shading_elements`;
                const shadingElementsData = await fetchWithModal<hbShadeGroup[]>(routeShades);
                handleError(loadModelShades, world, shadingElementsData);
            } catch (error) {
                console.error(error);
            } finally {
                console.log(`${teamId}/${projectId}/${modelId} data successfully loaded.`)
                setIsLoading(false);
            }
        }

        world.current.reset();
        if (showModel === true && modelId !== undefined && projectId !== undefined) {
            fetchModelDataFromServer();
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
            <InfoPanel />
            {/* <ResultsSidebar /> */}
            {/* <_AO_GUI_ world={world} /> */}
        </>)
}