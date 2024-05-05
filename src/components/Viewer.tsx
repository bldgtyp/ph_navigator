import { useEffect, useRef, useCallback, useContext } from 'react';
import { useParams } from "react-router-dom";
import { AppStateContext } from '../components/Project';
import * as THREE from 'three';
import { fetchSunPath } from '../hooks/fetchSunPath';
import { fetchModelFaces } from '../hooks/fetchModelFaces';
import { fetchModelSpaces } from '../hooks/fetchModelSpaces';
import { fetchModelHotWaterPiping } from '../hooks/fetchModelHotWaterPiping';
import { fetchModelERVDucting } from '../hooks/fetchModelERVDucting';
import { SceneSetup } from '../scene/SceneSetup';
import { convertHBFaceToMesh } from '../loaders/HoneybeeFace3D';
import { convertLBTPolyline3DtoLine } from '../loaders/LadybugPolyline3D';
import { convertLBTArc2DtoLine } from '../loaders/LadybugArc2D';
import { convertLBTLineSegment2DtoLine } from '../loaders/LadybugLineSegment2D';
import { convertLBTLineSegment3DtoLine } from '../loaders/LadybugLineSegment3D';
import { convertLBTArc3DtoLine } from '../loaders/LadybugArc3D';
import { convertLBTFace3DToMesh } from '../loaders/LadybugFace3D';
import { onResize } from '../handlers/onResize';
import { surfaceSelectModeOnMouseClick } from '../handlers/modeSurfaceQuery';
import { measureModeOnMouseClick, measureModeOnMouseMove } from '../handlers/modeMeasurement';
import { handleClearSelectedMesh } from '../handlers/selectMesh';
import { appMaterials } from '../scene/Materials';
import { PhHvacPipeTrunk } from '../types/PhHvacPipeTrunk';
import { addEventHandler, addMountHandler, addDismountHandler } from './AppState';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';

interface ViewerProps {
    world: React.MutableRefObject<SceneSetup>;
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    hoveringVertex: React.MutableRefObject<THREE.Vector3 | null>;
    dimensionLinesRef: React.MutableRefObject<THREE.Group>;
}

function Viewer(props: ViewerProps) {
    const { projectId } = useParams();
    const appStateContext = useContext(AppStateContext)

    const { world, selectedObjectRef, setSelectedObject, hoveringVertex, dimensionLinesRef } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);

    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Setup all the Event Listener Callbacks for the different App-States
    // For some reason, this does not work unless these are all wrapped in useCallback?
    addEventHandler(1, "click",
        useCallback(
            (e: any) => { surfaceSelectModeOnMouseClick(e, world.current, selectedObjectRef, setSelectedObject) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(2, "click",
        useCallback(
            (e: any) => { measureModeOnMouseClick(hoveringVertex, dimensionLinesRef) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );
    addEventHandler(2, "pointermove",
        useCallback(
            (e: any) => { measureModeOnMouseMove(e, world.current, hoveringVertex) }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            , [])
    );


    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Mount Handlers for AppStates
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
    addMountHandler(3, "showComments", () => { });
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
    });
    addMountHandler(6, "showERVDucting", () => {
        world.current.buildingGeometryOutlines.visible = true;
        world.current.ventilationGeometry.visible = true
    });
    addMountHandler(7, "showHotWaterPiping", () => {
        world.current.buildingGeometryOutlines.visible = true;
        world.current.pipeGeometry.visible = true
    });


    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Dismount Handlers for AppStates
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
    addDismountHandler(3, "hideComments", () => { });
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
    });
    addDismountHandler(6, "hideERVDucting", () => {
        world.current.buildingGeometryOutlines.visible = false;
        world.current.ventilationGeometry.visible = false
    });
    addDismountHandler(7, "hideHotWaterPiping", () => {
        world.current.buildingGeometryOutlines.visible = false;
        world.current.pipeGeometry.visible = false
    });


    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Add the App-State event-listeners and run the state's mount/un-mount actions
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
                console.log(key, handler)
                window.removeEventListener(key, handler);
            }
        };
    }, [appStateContext.appState]);


    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Setup the THREE Scene, Load in the Model data
    useEffect(() => {
        // Add the THREE Renderer to the DOM
        if (mountRef.current) {
            mountRef.current.appendChild(world.current.renderer.domElement);
        }

        // Handle Window Resize
        window.addEventListener('resize', (e) => onResize(world.current));

        // Get the Honeybee-Room-Face Geometry from the Server and Add them to the THREE Scene
        fetchModelFaces(`${projectId}/model_faces`).then(data => {
            data.forEach(face => {
                const geom = convertHBFaceToMesh(face)
                geom.mesh.material = appMaterials.geometryStandardMaterial;
                geom.mesh.visible = true;
                world.current.buildingGeometryMeshes.add(geom.mesh);

                geom.vertexHelper.visible = true;
                world.current.buildingGeometryMeshes.add(geom.vertexHelper);

                geom.wireframe.material = appMaterials.wireframeMaterial;
                geom.wireframe.visible = true;
                world.current.buildingGeometryOutlines.add(geom.wireframe);

                geom.vertices.visible = false;
                world.current.buildingGeometryVertices.add(geom.vertices);

                face.apertures.forEach(aperture => {
                    const apertureGeom = convertHBFaceToMesh(aperture);
                    apertureGeom.mesh.material = appMaterials.geometryWindowMaterial;
                    apertureGeom.mesh.visible = true;
                    world.current.buildingGeometryMeshes.add(apertureGeom.mesh);

                    apertureGeom.vertexHelper.visible = true;
                    world.current.buildingGeometryMeshes.add(apertureGeom.vertexHelper);

                    apertureGeom.wireframe.material = appMaterials.wireframeMaterial;
                    apertureGeom.wireframe.visible = true;
                    world.current.buildingGeometryOutlines.add(apertureGeom.wireframe);

                    apertureGeom.vertices.visible = false;
                    world.current.buildingGeometryVertices.add(apertureGeom.vertices);

                });
            });
        });

        // Get the Honeybee-PH-Space Geometry from the Server and Add it to the THREE Scene
        fetchModelSpaces(`${projectId}/model_spaces`).then(data => {
            data.forEach(space => {
                space.volumes.forEach(volume => {
                    volume.geometry.forEach(lbtFace3D => {
                        const geom = convertLBTFace3DToMesh(lbtFace3D)
                        geom.mesh.material = appMaterials.geometryStandardMaterial;
                        world.current.spaceGeometryMeshes.add(geom.mesh);
                        world.current.spaceGeometryMeshes.visible = false;
                        world.current.spaceGeometryMeshes.castShadow = false;

                        geom.wireframe.material = appMaterials.wireframeMaterial;
                        world.current.spaceGeometryOutlines.add(geom.wireframe);
                        world.current.spaceGeometryOutlines.visible = false;
                        world.current.spaceGeometryOutlines.castShadow = false;

                        world.current.spaceGeometryVertices.add(geom.vertices);
                        world.current.spaceGeometryVertices.visible = false;
                        world.current.spaceGeometryVertices.castShadow = false;

                    });
                });
            });
        });

        // Get the SubPath Geometry from the Server and Add it to the THREE Scene
        fetchSunPath(`${projectId}/sun_path`).then(data => {
            data.hourly_analemma_polyline3d.forEach((lbtPolyline3D) => {
                const line = convertLBTPolyline3DtoLine(lbtPolyline3D)
                line.computeLineDistances(); // Dashes don't work without this
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

        // Get the Hot-Water Piping from the Server and Add it to the THREE Scene
        fetchModelHotWaterPiping(`${projectId}/hot_water_systems`).then(data => {
            data.forEach((hw_system) => {
                for (const key in hw_system.distribution_piping) {
                    const trunk: PhHvacPipeTrunk = hw_system.distribution_piping[key];
                    for (const key in trunk.branches) {
                        const branch = trunk.branches[key]
                        for (const key in branch.fixtures) {
                            const fixture = branch.fixtures[key]
                            for (const key in fixture.segments) {
                                const segment = fixture.segments[key]
                                const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                                const fl = new LineSegments2(seg, appMaterials.pipeLineMaterial);
                                world.current.pipeGeometry.add(fl);
                            }
                        }
                    }
                }
                for (const key in hw_system.recirc_piping) {
                    const fixture = hw_system.recirc_piping[key]
                    for (const key in fixture.segments) {
                        const segment = fixture.segments[key]
                        const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                        const fl = new LineSegments2(seg, appMaterials.pipeLineMaterial);
                        world.current.pipeGeometry.add(fl);
                    }
                }
            });
            world.current.pipeGeometry.visible = false;
        });

        // Get the ERV Ducting from the Server and Add it to the THREE Scene
        fetchModelERVDucting(`${projectId}/ventilation_systems`).then(data => {
            data.forEach(hw_system => {
                hw_system.supply_ducting.forEach((duct) => {
                    console.log(duct)
                    for (const key in duct.segments) {
                        const segment = duct.segments[key]
                        const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                        const fl = new LineSegments2(seg, appMaterials.ductLineMaterial);
                        world.current.ventilationGeometry.add(fl);
                    }
                })
                hw_system.exhaust_ducting.forEach((duct) => {
                    console.log(duct)
                    for (const key in duct.segments) {
                        const segment = duct.segments[key]
                        const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                        const fl = new LineSegments2(seg, appMaterials.ductLineMaterial);
                        world.current.ventilationGeometry.add(fl);
                    }
                })
            });
            world.current.ventilationGeometry.visible = false;
        }
        );


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
    }, [projectId]);

    return <div ref={mountRef} />;

}

export default Viewer;

