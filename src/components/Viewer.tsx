import { useEffect, useRef } from 'react';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { SceneSetup } from '../scene/SceneSetup';
import { convertHBFaceToMesh } from '../loaders/HoneybeeFaces';
import * as THREE from 'three';
import { onMouseClick } from "../handlers/onClick";
import { onResize } from '../handlers/onResize';
import { onMouseMove } from '../handlers/onMouseMove';

interface ViewerProps {
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null;
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appState: React.MutableRefObject<number | null>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
}

function Viewer(props: ViewerProps) {
    const { selectedObjectRef, selectedObject, setSelectedObject, appState, hoveringVertex } = props;
    const world = new SceneSetup();
    const mountRef = useRef<HTMLDivElement | null>(null);
    const ray_caster = new THREE.Raycaster();

    useEffect(() => {
        // Add the THREE Renderer to the DOM
        if (mountRef.current) {
            mountRef.current.appendChild(world.renderer.domElement);
        }

        // Get the Honeybee Faces from the Server and Add them to the THREE Scene
        fetchModelFaces('model_faces').then(data => {
            data.forEach(face => {
                const geom = convertHBFaceToMesh(face)
                world.buildingGeometry.add(geom.mesh);
                world.buildingGeometry.add(geom.wireframe);
                world.buildingGeometry.add(new VertexNormalsHelper(geom.mesh, 0.15, 0x000000));

                face.apertures.forEach(aperture => {
                    const apertureGeom = convertHBFaceToMesh(aperture);
                    world.buildingGeometry.add(apertureGeom.mesh);
                    world.buildingGeometry.add(apertureGeom.wireframe);
                    world.buildingGeometry.add(new VertexNormalsHelper(apertureGeom.mesh, 0.15, 0x000000));
                });

            });
        });

        // Set Handlers user events
        window.addEventListener('click', (e) => onMouseClick(e, ray_caster,
            world, selectedObjectRef, setSelectedObject, appState, hoveringVertex));
        window.addEventListener('resize', (e) => onResize(world));
        window.addEventListener("pointermove", (e) => onMouseMove(e, ray_caster, world, appState, hoveringVertex));


        // THREE Animation Loop
        const animate = function () {
            requestAnimationFrame(animate);
            world.controls.update();
            world.renderer.render(world.scene, world.camera);
            world.labelRenderer.render(world.scene, world.camera)
        };

        animate();

    }, []);

    return <div ref={mountRef} />;

}

export default Viewer;

