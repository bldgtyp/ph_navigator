// A PH-Navigator Project's 3D Viewer Component

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { SceneSetup } from '../scene/SceneSetup';
import { useAppStateContext } from '../contexts/app_state_context';
import { useSelectedObjectContext } from '../contexts/selected_object_context';
import { useHoverObjectContext } from '../contexts/hover_object_context';
import { onResize } from '../handlers/onResize';
import { surfaceSelectModeOnMouseClick, surfaceSelectModeOnMouseOver } from '../handlers/modeSurfaceQuery';
import { measureModeOnMouseClick, measureModeOnMouseMove } from '../handlers/modeMeasurement';
import { addEventHandler, addMountHandler, addDismountHandler } from './AppState';
import { spacesModeOnMouseClick, spacesModeOnMouseOver } from '../handlers/modeSpacesQuery';
import { handleClearSelectedMesh } from '../handlers/modeSurfaceQuery';
import { handleClearSelectedSpace } from '../handlers/modeSpacesQuery';
import { pipingModeOnMouseClick } from '../handlers/modePipes';
import { handleClearSelectedLine } from '../handlers/modePipes';

interface ViewerProps {
    world: React.MutableRefObject<SceneSetup>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
    dimensionLinesRef: React.MutableRefObject<THREE.Group>;
}

function Viewer(props: ViewerProps) {
    const appStateContext = useAppStateContext();
    const selectedObjectContext = useSelectedObjectContext();
    const hoverObjectContext = useHoverObjectContext();

    const { world, hoveringVertex, dimensionLinesRef } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);

    // Setup all the Event Listener Callbacks for the different App-States
    // For some reason, this does not work unless these are all wrapped in useCallback?
    // ------------------------------------------------------------------------
    addEventHandler(1, "click",
        useCallback(
            (e: any) => { surfaceSelectModeOnMouseClick(e, world.current, selectedObjectContext) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(1, "pointermove",
        useCallback(
            (e: any) => { surfaceSelectModeOnMouseOver(e, world.current, hoverObjectContext) }
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
    addEventHandler(4, "click",
        useCallback(
            (e: any) => { spacesModeOnMouseClick(e, world.current, selectedObjectContext) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(4, "pointermove",
        useCallback(
            (e: any) => { spacesModeOnMouseOver(e, world.current, hoverObjectContext) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(7, "click",
        useCallback(
            (e: any) => { pipingModeOnMouseClick(e, world.current, selectedObjectContext) }
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
        hoveringVertex.current = null;
        dimensionLinesRef.current.clear()
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    });
    addDismountHandler(1, "hideSurfaceQuery", () => {
        handleClearSelectedMesh(selectedObjectContext)
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
        handleClearSelectedSpace(selectedObjectContext)
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
        handleClearSelectedLine(selectedObjectContext)
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
            world.current.composer.render();
            world.current.labelRenderer.render(world.current.scene, world.current.camera)
        };

        animate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={mountRef} />

}

export default Viewer;

