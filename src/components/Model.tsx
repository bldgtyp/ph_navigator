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

export function Model(props: ModelProps) {
    const { projectId, modelId } = useParams();
    const { world } = props;


    // Load the Model-Elements from the API based on the project / model ids
    // ------------------------------------------------------------------------
    useEffect(() => {
        if (modelId !== undefined && projectId !== undefined) {
            fetchModelFaces(`${projectId}/${modelId}/model_faces`).then(data => loadModelFaces(world, data))
            // fetchModelSpaces(`${projectId}/${modelId}/model_spaces`).then(data => loadModelSpaces(world, data));
            // fetchSunPath(`${projectId}/${modelId}/sun_path`).then(data => loadModelSunPath(world, data));
            // fetchModelHotWaterPiping(`${projectId}/${modelId}/hot_water_systems`).then(data => loadModelHotWaterPiping(world, data));
            // fetchModelERVDucting(`${projectId}/${modelId}/ventilation_systems`).then(data => loadModelERVDucting(world, data));
            // fetchModelShades(`${projectId}/${modelId}/shading_elements`).then(data => loadModelShades(world, data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, modelId]);

    return (null);
}