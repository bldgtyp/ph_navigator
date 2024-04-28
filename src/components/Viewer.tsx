import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { SceneSetup } from '../scene/SceneSetup';
import { convertHBFaceToMesh } from '../loaders/HoneybeeFaces';
import { onResize } from '../handlers/onResize';
import { surfaceSelectModeOnMouseClick } from '../handlers/surfaceSelectEvents';
import { measureModeOnMouseClick, measureModeOnMouseMove } from '../handlers/measure';

interface ViewerProps {
    world: React.MutableRefObject<SceneSetup>;
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null;
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appStateRef: React.MutableRefObject<number | null>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
}

type EventListeners = {
    [key: number]: {
        [key: string]: (e: any) => void;
    };
};

function Viewer(props: ViewerProps) {
    const { world, selectedObjectRef, selectedObject, setSelectedObject, appStateRef: appStateRef, hoveringVertex } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);
    const ray_caster = new THREE.Raycaster();

    // Setup all the Event Listener Callbacks
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
                    measureModeOnMouseClick(
                        e, world.current, selectedObjectRef, setSelectedObject, hoveringVertex)
                }, [world.current, selectedObjectRef, setSelectedObject, hoveringVertex]
            ),
            pointermove: useCallback(
                (e: any) => { measureModeOnMouseMove(e, ray_caster, world.current, appStateRef, hoveringVertex) }, []
            ),
        }
    }

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
                world.current.buildingGeometry.add(geom.mesh);
                world.current.buildingGeometry.add(geom.wireframe);
                world.current.buildingGeometry.add(new VertexNormalsHelper(geom.mesh, 0.15, 0x000000));

                face.apertures.forEach(aperture => {
                    const apertureGeom = convertHBFaceToMesh(aperture);
                    world.current.buildingGeometry.add(apertureGeom.mesh);
                    world.current.buildingGeometry.add(apertureGeom.wireframe);
                    world.current.buildingGeometry.add(new VertexNormalsHelper(apertureGeom.mesh, 0.15, 0x000000));
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

    useEffect(() => {
        // Setup Event Listeners based on the App-State
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


    return <div ref={mountRef} />;

}

export default Viewer;

