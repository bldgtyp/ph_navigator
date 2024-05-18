// 3D-Geometry and Views of a Specific Model Instance

import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { SceneSetup } from '../scene/SceneSetup';
import InfoPanel from './InfoPanel';
import ResultsSidebar from './ResultsSidebar';

import { fetchModelServer } from "../hooks/fetchModelServer";
import { fetchModelERVDucting } from '../hooks/_old_/fetchModelERVDucting';
import { fetchModelShades } from '../hooks/_old_/fetchModelShades';

import { loadModelFaces } from '../loaders/load_model_faces';
import { loadModelSpaces } from '../loaders/load_model_spaces';
import { loadModelSunPath } from '../loaders/load_sun_path';
import { loadModelHotWaterPiping } from '../loaders/load_hot_water_piping';
import { loadModelERVDucting } from '../loaders/load_erv_ducting';
import { loadModelShades } from '../loaders/load_model_shades';


import { hbFace } from "../types/honeybee/face";
import { hbPHSpace } from "../types/honeybee_ph/space";
import { ModelView } from "../types/fake_database/ModelView";
import { lbtSunPathDTO } from "../types/ladybug/sunpath";
import { hbPhHvacHotWaterSystem } from "../types/honeybee_phhvac/hot_water_system";



type ModelProps = {
    world: React.MutableRefObject<SceneSetup>;
    showModel: boolean;
};

function handleError<T>(_func: any, world: React.MutableRefObject<SceneSetup>, data: T[] | { error: string }) {
    if (!Array.isArray(data) && data.error) {
        console.error(data.error);
        return [];
    } else {
        return _func(world, data);
    }
};

export function Model(props: ModelProps) {
    console.log("Rendering Model Component...")
    const { world, showModel } = props;
    const { teamId, projectId, modelId } = useParams();

    // Load the Model-Elements from the API based on the project / model ids
    // ------------------------------------------------------------------------
    useEffect(() => {
        console.log("Loading Model Elements...")
        world.current.reset();
        if (showModel === true && modelId !== undefined && projectId !== undefined) {

            fetchModelServer<hbFace[] | { error: string }>(`${teamId}/${projectId}/${modelId}/load_hb_model`)
                .then(data => {

                    fetchModelServer<hbFace[] | { error: string }>(`${teamId}/${projectId}/${modelId}/faces`)
                        .then(data => handleError(loadModelFaces, world, data))

                    fetchModelServer<hbPHSpace[] | { error: string }>(`${teamId}/${projectId}/${modelId}/spaces`)
                        .then(data => handleError(loadModelSpaces, world, data));

                    fetchModelServer<lbtSunPathDTO>(`${teamId}/${projectId}/${modelId}/sun_path`).then(data => loadModelSunPath(world, data));

                    fetchModelServer<hbPhHvacHotWaterSystem[]>(`${teamId}/${projectId}/${modelId}/hot_water_systems`)
                        .then(data => handleError(loadModelHotWaterPiping, world, data));

                    // fetchModelERVDucting(`${teamId}/${projectId}/${modelId}/ventilation_systems`)
                    //     .then(data => handleError(loadModelERVDucting, world, data));

                    // fetchModelShades(`${teamId}/${projectId}/${modelId}/shading_elements`)
                    //     .then(data => handleError(loadModelShades, world, data));
                })

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId, projectId, modelId, showModel]);

    return (
        <>
            <ResultsSidebar />
            <InfoPanel />
        </>)
}