import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { SceneSetup } from '../scene/SceneSetup';
import { convertHBFaceToMesh } from '../loaders/HoneybeeFaces';
import { onResize } from '../handlers/onResize';
import { surfaceSelectModeOnMouseClick } from '../handlers/modeSurfaceQuery';
import { measureModeOnMouseClick, measureModeOnMouseMove } from '../handlers/modeMeasurement';
import { handleClearSelectedMesh } from '../handlers/selectMesh';

interface ViewerProps {
    world: React.MutableRefObject<SceneSetup>;
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null;
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appStateRef: React.MutableRefObject<number | null>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
    dimensionLinesRef: React.MutableRefObject<THREE.Group>;
}

type EventListeners = {
    [key: number]: {
        [key: string]: (e: any) => void;
    };
};

function resetView(
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>,
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>,
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>,
    dimensionLines: React.MutableRefObject<THREE.Group>,
) {
    handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
    hoveringVertex.current = null;
    dimensionLines.current.clear()
}

function Viewer(props: ViewerProps) {
    const { world, selectedObjectRef, selectedObject, setSelectedObject, appStateRef: appStateRef, hoveringVertex, dimensionLinesRef } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);
    const ray_caster = new THREE.Raycaster();

    // ------------------------------------------------------------------------
    // Setup all the Event Listener Callbacks for the different App-States
    const eventListeners: EventListeners = {
        "0": {
            click: useCallback((e: any) => { }, []),
        },
        "1": {
            click: useCallback(
                (e: any) => {
                    surfaceSelectModeOnMouseClick(
                        e, ray_caster, world.current, selectedObjectRef, setSelectedObject)
                }, [world.current, selectedObjectRef, setSelectedObject]
            ),
        },
        "2": {
            click: useCallback(
                (e: any) => {
                    measureModeOnMouseClick(hoveringVertex, dimensionLinesRef)
                }, [world.current, hoveringVertex]
            ),
            pointermove: useCallback(
                (e: any) => { measureModeOnMouseMove(e, world.current, hoveringVertex) }, []
            ),
        }
    }

    // Setup Event Listeners based on the App-State
    useEffect(() => {
        resetView(selectedObjectRef, setSelectedObject, hoveringVertex, dimensionLinesRef);
        for (let state in eventListeners) {
            for (let event in eventListeners[state]) {
                if (state !== appStateRef.current?.toString()) {
                    window.removeEventListener(event, eventListeners[state][event]);
                } else {
                    window.addEventListener(event, eventListeners[state][event]);
                }
            }
        }

    }, [appStateRef.current]);

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

