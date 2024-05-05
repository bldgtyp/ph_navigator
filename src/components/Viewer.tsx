import { useEffect, useRef, useCallback, useContext } from 'react';
import { AppStateContext as AppStateContext } from '../App';
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
    const appStateContext = useContext(AppStateContext)

    const { world, selectedObjectRef, setSelectedObject, hoveringVertex, dimensionLinesRef } = props;
    const mountRef = useRef<HTMLDivElement | null>(null);
    const ray_caster = new THREE.Raycaster();

    // ------------------------------------------------------------------------
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
    // ------------------------------------------------------------------------
    // Mount Handlers for AppStates
    addMountHandler(0, "showDefault", useCallback(() => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
    }, []));
    addMountHandler(1, "showFaces", useCallback(() => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
    }, []));
    addMountHandler(2, "showFaces", useCallback(() => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
    }, []));
    addMountHandler(3, "showComments", useCallback(() => { }, []));
    addMountHandler(4, "showSpaces", useCallback(() => {
        world.current.spaceGeometryMeshes.visible = true;
        world.current.spaceGeometryOutlines.visible = true;
        world.current.spaceGeometryVertices.visible = false;
        world.current.buildingGeometryOutlines.visible = true
    }, []));
    addMountHandler(5, "showSunPath", useCallback(() => {
        world.current.buildingGeometryMeshes.visible = true;
        world.current.buildingGeometryOutlines.visible = true;
        world.current.buildingGeometryVertices.visible = true;
        world.current.sunPathDiagram.visible = true;
    }, []));
    addMountHandler(6, "showERVDucting", useCallback(() => {
        world.current.buildingGeometryOutlines.visible = true;
        world.current.ventilationGeometry.visible = true
    }, []));
    addMountHandler(7, "showHotWaterPiping", useCallback(() => {
        world.current.buildingGeometryOutlines.visible = true;
        world.current.pipeGeometry.visible = true
    }, []));


    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Dismount Handlers for AppStates
    addDismountHandler(0, "hideDefault", useCallback(() => {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        hoveringVertex.current = null;
        dimensionLinesRef.current.clear()
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    }, []));
    addDismountHandler(1, "hideSurfaceQuery", useCallback(() => {
        handleClearSelectedMesh(selectedObjectRef, setSelectedObject)
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    }, []));
    addDismountHandler(2, "hideDimensionLines", useCallback(() => {
        hoveringVertex.current = null;
        dimensionLinesRef.current.clear()
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    }, []));
    addDismountHandler(3, "hideComments", useCallback(() => { }, []));
    addDismountHandler(4, "hideSpaces", useCallback(() => {
        world.current.spaceGeometryMeshes.visible = false;
        world.current.spaceGeometryOutlines.visible = false;
        world.current.spaceGeometryVertices.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
    }, []));
    addDismountHandler(5, "hideSunPath", useCallback(() => {
        world.current.sunPathDiagram.visible = false;
        world.current.buildingGeometryMeshes.visible = false;
        world.current.buildingGeometryOutlines.visible = false;
        world.current.buildingGeometryVertices.visible = false;
    }, []));
    addDismountHandler(6, "hideERVDucting", useCallback(() => {
        world.current.buildingGeometryOutlines.visible = false;
        world.current.ventilationGeometry.visible = false
    }, []));
    addDismountHandler(7, "hideHotWaterPiping", useCallback(() => {
        world.current.buildingGeometryOutlines.visible = false;
        world.current.pipeGeometry.visible = false
    }, []));


    // ------------------------------------------------------------------------
    // ------------------------------------------------------------------------
    // Add the App-State event-listeners and run the state's mount/un-mount actions
    useEffect(() => {
        // Run the new State's mount handlers
        for (let key in appStateContext.appState.mountHandlers) {
            appStateContext.appState.mountHandlers[key]();
        }

        // Add the new state's event listeners
        for (let key in appStateContext.appState.eventHandlers) {
            let handler: any = appStateContext.appState.eventHandlers[key];
            window.addEventListener(key, handler);
        }

        // Cleanup function to remove the previous States' view and event listeners
        const prevState = appStateContext.appState;
        return () => {
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
        fetchModelFaces('model_faces').then(data => {
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
        fetchModelSpaces('model_spaces').then(data => {
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
        fetchSunPath('sun_path').then(data => {
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
        fetchModelHotWaterPiping('hot_water_systems').then(data => {
            data.forEach((hw_system) => {
                for (let key in hw_system.distribution_piping) {
                    const trunk: PhHvacPipeTrunk = hw_system.distribution_piping[key];
                    for (let key in trunk.branches) {
                        const branch = trunk.branches[key]
                        for (let key in branch.fixtures) {
                            const fixture = branch.fixtures[key]
                            for (let key in fixture.segments) {
                                const segment = fixture.segments[key]
                                const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                                const fl = new LineSegments2(seg, appMaterials.pipeLineMaterial);
                                world.current.pipeGeometry.add(fl);
                            }
                        };
                    };
                };
                for (let key in hw_system.recirc_piping) {
                    const fixture = hw_system.recirc_piping[key]
                    for (let key in fixture.segments) {
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
        fetchModelERVDucting('ventilation_systems').then(data => {
            data.forEach(hw_system => {
                hw_system.supply_ducting.forEach((duct) => {
                    console.log(duct)
                    for (let key in duct.segments) {
                        const segment = duct.segments[key]
                        const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                        const fl = new LineSegments2(seg, appMaterials.ductLineMaterial);
                        world.current.ventilationGeometry.add(fl);
                    }
                })
                hw_system.exhaust_ducting.forEach((duct) => {
                    console.log(duct)
                    for (let key in duct.segments) {
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

    }, []);

    return <div ref={mountRef} />;

}

export default Viewer;

