import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { fetchSunPath } from '../hooks/fetchSunPath';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { SceneSetup } from '../scene/SceneSetup';
import { convertHBFaceToMesh } from '../loaders/HoneybeeFaces';
import { convertLBTPolyline3DtoLine } from '../loaders/LadybugPolyline3D';
import { convertLBTArc2DtoLine } from '../loaders/LadybugArc2D';
import { convertLBTLineSegment2DtoLine } from '../loaders/LadybugLineSegment2D';
import { convertLBTArc3DtoLine } from '../loaders/LadybugArc3D';
import { onResize } from '../handlers/onResize';
import { surfaceSelectModeOnMouseClick } from '../handlers/modeSurfaceQuery';
import { measureModeOnMouseClick, measureModeOnMouseMove } from '../handlers/modeMeasurement';
import { handleClearSelectedMesh } from '../handlers/selectMesh';
import { AppState, addEventHandler, addDismountHandler } from './AppState';

interface ViewerProps {
    world: React.MutableRefObject<SceneSetup>;
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null;
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appStateRef: React.MutableRefObject<AppState>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
    dimensionLinesRef: React.MutableRefObject<THREE.Group>;
}

type EventListeners = {
    [key: number]: {
        [key: string]: (e: any) => void;
    };
};

function Viewer(props: ViewerProps) {
    const { world, selectedObjectRef, selectedObject, setSelectedObject, appStateRef: appStateRef, hoveringVertex, dimensionLinesRef } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);
    const ray_caster = new THREE.Raycaster();

    // ------------------------------------------------------------------------
    // Setup all the Event Listener Callbacks for the different App-States
    addEventHandler(1, "click",
        useCallback(
            (e: any) => {
                surfaceSelectModeOnMouseClick(
                    e, ray_caster, world.current, selectedObjectRef, setSelectedObject)
            }, [world.current, selectedObjectRef, setSelectedObject]
        )
    );
    addEventHandler(2, "click",
        useCallback(
            (e: any) => {
                measureModeOnMouseClick(hoveringVertex, dimensionLinesRef)
            }, [world.current, hoveringVertex]
        )
    );
    addEventHandler(2, "pointermove",
        useCallback(
            (e: any) => { measureModeOnMouseMove(e, world.current, hoveringVertex) }, []
        )
    );

    // ------------------------------------------------------------------------
    addDismountHandler(1, "clearSelectedMesh", useCallback(() => {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    }, []));
    addDismountHandler(2, "clearDimensionLines", useCallback(() => {
        hoveringVertex.current = null;
        dimensionLinesRef.current.clear()
    }, []));

    // ------------------------------------------------------------------------
    // Setup AppState Events and Visibility
    useEffect(() => {
        // Add in the new state's visibility

        // Add the new state's event listeners
        for (let key in appStateRef.current.eventHandlers) {
            let handler: any = appStateRef.current.eventHandlers[key];
            window.addEventListener(key, handler);
        }

        // Return a cleanup function that will be called before the next time the effect is run
        const prevState = appStateRef.current;
        return () => {
            console.log('Dismounting', prevState);

            // Run the previous State's dismount handlers
            for (let key in prevState.dismountHandlers) {
                prevState.dismountHandlers[key]();
            }

            // Remove the previous state's event listeners
            for (let key in prevState.eventHandlers) {
                let handler: any = prevState.eventHandlers[key];
                window.removeEventListener(key, handler);
            }
        };
    }, [appStateRef.current]); // Re-run the effect when appStateRef.current changes


    // ------------------------------------------------------------------------
    // Setup the THREE Scene, Load in the Model data
    useEffect(() => {
        // Add the THREE Renderer to the DOM
        if (mountRef.current) {
            mountRef.current.appendChild(world.current.renderer.domElement);
        }

        // Handle Window Resize
        window.addEventListener('resize', (e) => onResize(world.current));

        // Get the Honeybee Faces from the Server and Add them to the THREE Scene
        fetchModelFaces('model_faces').then(data => {
            data.forEach(face => {
                const geom = convertHBFaceToMesh(face)
                world.current.buildingGeometryMeshes.add(geom.mesh);
                world.current.buildingGeometryMeshes.add(new VertexNormalsHelper(geom.mesh, 0.15, 0x000000));
                world.current.buildingGeometryOutlines.add(geom.wireframe);
                world.current.buildingGeometryVertices.add(geom.vertices);

                face.apertures.forEach(aperture => {
                    const apertureGeom = convertHBFaceToMesh(aperture);
                    world.current.buildingGeometryMeshes.add(apertureGeom.mesh);
                    world.current.buildingGeometryMeshes.add(new VertexNormalsHelper(apertureGeom.mesh, 0.15, 0x000000));
                    world.current.buildingGeometryOutlines.add(apertureGeom.wireframe);
                    world.current.buildingGeometryVertices.add(apertureGeom.vertices);
                });

            });
        });

        // Get the SubPath Geometry from the Server and Add it to the THREE Scene
        fetchSunPath('sun_path').then(data => {
            data.hourly_analemma_polyline3d.forEach((lbtPolyline3D) => {
                const line = convertLBTPolyline3DtoLine(lbtPolyline3D)
                world.current.sunPathDiagram.add(line);
            });
            data.monthly_day_arc3d.forEach((lbtArc3D) => {
                const line = convertLBTArc3DtoLine(lbtArc3D)
                world.current.sunPathDiagram.add(line);
            });
            data.compass.all_boundary_circles.forEach((lbtArc2D) => {
                const arc1 = convertLBTArc2DtoLine(lbtArc2D)
                world.current.sunPathDiagram.add(arc1);
            });
            data.compass.major_azimuth_ticks.forEach((lbtLineSegment2D) => {
                const line = convertLBTLineSegment2DtoLine(lbtLineSegment2D)
                world.current.sunPathDiagram.add(line);
            });
            data.compass.minor_azimuth_ticks.forEach((lbtLineSegment2D) => {
                const line = convertLBTLineSegment2DtoLine(lbtLineSegment2D)
                world.current.sunPathDiagram.add(line);
            });
            world.current.sunPathDiagram.visible = false;
        });

        // THREE Animation Loop
        const animate = function () {
            requestAnimationFrame(animate);
            world.current.controls.update();
            world.current.renderer.render(world.current.scene, world.current.camera);
            world.current.labelRenderer.render(world.current.scene, world.current.camera)
        };

        animate();

    }, []);

    return <div ref={mountRef} />;

}

export default Viewer;

