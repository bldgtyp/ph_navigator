// 3D-Geometry and Views of a Specific Model Instance

import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { SceneSetup } from '../scene/SceneSetup';
import { fetchSunPath } from '../hooks/fetchSunPath';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { fetchModelSpaces } from '../hooks/fetchModelSpaces';
import { fetchModelHotWaterPiping } from '../hooks/fetchModelHotWaterPiping';
import { fetchModelERVDucting } from '../hooks/fetchModelERVDucting';
import { fetchModelShades } from '../hooks/fetchModelShades';
import { loadModelFaces } from '../loaders/load_model_faces';
import { loadModelSpaces } from '../loaders/load_model_spaces';
import { loadModelSunPath } from '../loaders/load_sun_path';
import { loadModelHotWaterPiping } from '../loaders/load_hot_water_piping';
import { loadModelERVDucting } from '../loaders/load_erv_ducting';
import { loadModelShades } from '../loaders/load_model_shades';

type ModelProps = {
    world: React.MutableRefObject<SceneSetup>;
};

function handleError<T>(_func: any, world: React.MutableRefObject<SceneSetup>, data: T[] | { error: string }) {
    if (Array.isArray(data)) {
        return _func(world, data);
    } else {
        console.error(data.error);
        return [];
    }
}

export function Model(props: ModelProps) {
    const { teamId, projectId, modelId } = useParams();
    const { world } = props;

    // Load the Model-Elements from the API based on the project / model ids
    // ------------------------------------------------------------------------
    useEffect(() => {
        world.current.reset();
        if (modelId !== undefined && projectId !== undefined) {

            fetchModelFaces(`${teamId}/${projectId}/${modelId}/model_faces`)
                .then(data => handleError(loadModelFaces, world, data))

            fetchModelSpaces(`${teamId}/${projectId}/${modelId}/model_spaces`)
                .then(data => handleError(loadModelSpaces, world, data));

            // fetchSunPath(`${teamId}/${projectId}/${modelId}/sun_path`).then(data => loadModelSunPath(world, data));

            fetchModelHotWaterPiping(`${teamId}/${projectId}/${modelId}/hot_water_systems`)
                .then(data => handleError(loadModelHotWaterPiping, world, data));

            fetchModelERVDucting(`${teamId}/${projectId}/${modelId}/ventilation_systems`)
                .then(data => handleError(loadModelERVDucting, world, data));

            fetchModelShades(`${teamId}/${projectId}/${modelId}/shading_elements`)
                .then(data => handleError(loadModelShades, world, data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teamId, projectId, modelId]);

    return (null);
}