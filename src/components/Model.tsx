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

import { fetchModelDataFromServer } from "../api/model";
import { loadModelFaces } from '../loaders/load_model_faces';
import { loadModelSpaces } from '../loaders/load_model_spaces';
import { loadModelSunPath } from '../loaders/load_sun_path';
import { loadModelHotWaterPiping } from '../loaders/load_hot_water_piping';
import { loadModelERVDucting } from '../loaders/load_erv_ducting';
import { loadModelShades } from '../loaders/load_model_shades';


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
function handleLoadError<T>(_func: any, world: React.MutableRefObject<SceneSetup>, data: T[] | null) {
    if (!data) {
        return [];
    } else if (Array.isArray(data)) {
        return _func(world, data);
    }
}

function Model(props: ModelProps) {
    console.log("Rendering Model Component...")
    const { world, showModel } = props;
    const { teamId, projectId, modelId } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    // Load the Model-Elements from the Server based on: team-id / project-id / model-id
    // ------------------------------------------------------------------------
    useEffect(() => {
        async function loadModelDataIntoWorld(teamId: string, projectId: string, modelId: string) {
            try {
                const modelData = await fetchModelDataFromServer(teamId, projectId, modelId);
                if (modelData === null) { return }
                handleLoadError(loadModelFaces, world, modelData.facesData);
                handleLoadError(loadModelSpaces, world, modelData.spacesData);
                handleLoadError(loadModelSunPath, world, modelData.sunPathData);
                handleLoadError(loadModelHotWaterPiping, world, modelData.hotWaterSystemData);
                handleLoadError(loadModelERVDucting, world, modelData.ventilationSystemData);
                handleLoadError(loadModelShades, world, modelData.shadingElementsData);
            } catch (error) {
                alert(`Error loading model data: ${error}`);
            } finally {
                setIsLoading(false);
            }
        }

        world.current.reset();
        if (showModel === true && modelId !== undefined && projectId !== undefined && teamId !== undefined) {
            loadModelDataIntoWorld(teamId, projectId, modelId);
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

export default Model;