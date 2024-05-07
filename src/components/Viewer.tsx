// A PH-Navigator Project's 3D Viewer Component

import { useEffect, useRef, useCallback } from 'react';
import { useParams } from "react-router-dom";
import * as THREE from 'three';
import { fetchSunPath } from '../hooks/fetchSunPath';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { fetchModelSpaces } from '../hooks/fetchModelSpaces';
import { fetchModelHotWaterPiping } from '../hooks/fetchModelHotWaterPiping';
import { fetchModelERVDucting } from '../hooks/fetchModelERVDucting';
import { fetchModelShades } from '../hooks/fetchModelShades';
import { SceneSetup } from '../scene/SceneSetup';
import { onResize } from '../handlers/onResize';
import { surfaceSelectModeOnMouseClick } from '../handlers/modeSurfaceQuery';
import { measureModeOnMouseClick, measureModeOnMouseMove } from '../handlers/modeMeasurement';
import { handleClearSelectedMesh } from '../handlers/selectMesh';
import { addEventHandler, addMountHandler, addDismountHandler } from './AppState';
import { loadModelFaces } from '../loaders/load_model_faces';
import { loadModelSpaces } from '../loaders/load_model_spaces';
import { loadModelSunPath } from '../loaders/load_sun_path';
import { loadModelHotWaterPiping } from '../loaders/load_hot_water_piping';
import { loadModelERVDucting } from '../loaders/load_erv_ducting';
import { loadModelShades } from '../loaders/load_model_shades';
import { useAppStateContext } from '../contexts/app_state_context';

interface ViewerProps {
    world: React.MutableRefObject<SceneSetup>;
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
    dimensionLinesRef: React.MutableRefObject<THREE.Group>;
}

function Viewer(props: ViewerProps) {
    const { projectId } = useParams();
    const appStateContext = useAppStateContext();

    const { world, selectedObjectRef, setSelectedObject, hoveringVertex, dimensionLinesRef } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);

    // Setup all the Event Listener Callbacks for the different App-States
    // For some reason, this does not work unless these are all wrapped in useCallback?
    // ------------------------------------------------------------------------
    addEventHandler(1, "click",
        useCallback(
            (e: any) => { surfaceSelectModeOnMouseClick(e, world.current, selectedObjectRef, setSelectedObject) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(2, "click",
        useCallback(
            () => { measureModeOnMouseClick(hoveringVertex, dimensionLinesRef) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(2, "pointermove",
        useCallback(
            (e: any) => { measureModeOnMouseMove(e, world.current, hoveringVertex) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );


    // Mount Handlers for AppStates
    // ------------------------------------------------------------------------
    addMountHandler(0, "showDefault", () => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
    });
    addMountHandler(1, "showFaces", () => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
    });
    addMountHandler(2, "showDimensionLines", () => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
    });
    addMountHandler(3, "showComments", () => { console.log("Show Comments") });
    addMountHandler(4, "showSpaces", () => {
        world.current.spaceGeometryMeshes.visible = true;
        world.current.spaceGeometryOutlines.visible = true;
        world.current.spaceGeometryVertices.visible = false;
        world.current.buildingGeometryOutlines.visible = true
    });
    addMountHandler(5, "showSunPath", () => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
        world.current.sunPathDiagram.visible = true;
        world.current.shadingGeometry.visible = true;
    });
    addMountHandler(6, "showERVDucting", () => {
        world.current.buildingGeometryOutlines.visible = true;
        world.current.ventilationGeometry.visible = true
    });
    addMountHandler(7, "showHotWaterPiping", () => {
        world.current.buildingGeometryOutlines.visible = true;
        world.current.pipeGeometry.visible = true
    });


    // Dismount Handlers for AppStates
    // ------------------------------------------------------------------------
    addDismountHandler(0, "hideDefault", () => {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        hoveringVertex.current = null;
        dimensionLinesRef.current.clear()
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    });
    addDismountHandler(1, "hideSurfaceQuery", () => {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    });
    addDismountHandler(2, "hideDimensionLines", () => {
        hoveringVertex.current = null;
        dimensionLinesRef.current.clear()
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    });
    addDismountHandler(3, "hideComments", () => { console.log("Hide Comments") });
    addDismountHandler(4, "hideSpaces", () => {
        world.current.spaceGeometryMeshes.visible = false;
        world.current.spaceGeometryOutlines.visible = false;
        world.current.spaceGeometryVertices.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
    });
    addDismountHandler(5, "hideSunPath", () => {
        world.current.sunPathDiagram.visible = false;
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
        world.current.shadingGeometry.visible = false;
    });
    addDismountHandler(6, "hideERVDucting", () => {
        world.current.buildingGeometryOutlines.visible = false;
        world.current.ventilationGeometry.visible = false
    });
    addDismountHandler(7, "hideHotWaterPiping", () => {
        world.current.buildingGeometryOutlines.visible = false;
        world.current.pipeGeometry.visible = false
    });


    // Add the App-State event-listeners and run the state's mount/un-mount actions
    // ------------------------------------------------------------------------
    useEffect(() => {
        // Run the new State's mount handlers
        for (const key in appStateContext.appState.mountHandlers) {
            appStateContext.appState.mountHandlers[key]();
        }

        // Add the new state's event listeners
        for (const key in appStateContext.appState.eventHandlers) {
            const handler: any = appStateContext.appState.eventHandlers[key];
            window.addEventListener(key, handler);
        }

        // Cleanup function to remove the previous States' view and event listeners
        const prevState = appStateContext.appState;
        return () => {
            // Run the previous State's dismount handlers
            for (const key in prevState.dismountHandlers) {
                prevState.dismountHandlers[key]();
            }

            // Remove the previous state's event listeners
            for (const key in prevState.eventHandlers) {
                const handler: any = prevState.eventHandlers[key];
                window.removeEventListener(key, handler);
            }
        };
    }, [appStateContext.appState]);


    // Load the Model-Elements from the Server
    // ------------------------------------------------------------------------
    useEffect(() => {
        // Get the Honeybee JSON Model Elements and add them to the THREE Scene
        fetchModelFaces(`${projectId}/model_faces`).then(data => loadModelFaces(world, data))
        fetchModelSpaces(`${projectId}/model_spaces`).then(data => loadModelSpaces(world, data));
        fetchSunPath(`${projectId}/sun_path`).then(data => loadModelSunPath(world, data));
        fetchModelHotWaterPiping(`${projectId}/hot_water_systems`).then(data => loadModelHotWaterPiping(world, data));
        fetchModelERVDucting(`${projectId}/ventilation_systems`).then(data => loadModelERVDucting(world, data));
        fetchModelShades(`${projectId}/shading_elements`).then(data => loadModelShades(world, data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);



    // Setup the THREE Scene, Run the Animation
    // ------------------------------------------------------------------------
    useEffect(() => {
        // Add the THREE Renderer to the DOM
        if (mountRef.current) {
            mountRef.current.appendChild(world.current.renderer.domElement);
        }


        // Handle Window Resize
        window.addEventListener('resize', () => onResize(world.current));

        // THREE Animation Loop 
        const animate = function () {
            requestAnimationFrame(animate);
            world.current.controls.update();
            // world.current.composer.render();
            world.current.renderer.render(world.current.scene, world.current.camera);
            world.current.labelRenderer.render(world.current.scene, world.current.camera)
        };

        animate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={mountRef} />;

}

export default Viewer;

