import * as THREE from 'three';
import { hbPhHvacHotWaterSystem } from "../types/honeybee_phhvac/hot_water_system";
import { SceneSetup } from '../scene/SceneSetup';
import { convertLBTLineSegment3DtoLine } from '../to_three_geometry/ladybug_geometry/geometry3d/line';
import { appMaterials } from '../scene/Materials';
import { hbPhHvacPipeTrunk } from '../types/honeybee_phhvac/hot_water_piping';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';

export function loadModelHotWaterPiping(world: React.MutableRefObject<SceneSetup>, data: hbPhHvacHotWaterSystem[]) {
    data.forEach((hw_system) => {
        // -- Distribution piping -------------------------------------------------------
        for (const key in hw_system.distribution_piping) {
            const trunk: hbPhHvacPipeTrunk = hw_system.distribution_piping[key];

            for (const key in trunk.branches) {
                const trunkGroup = new THREE.Group()
                trunkGroup.name = trunk.display_name
                trunkGroup.userData['identifier'] = trunk.identifier
                trunkGroup.userData['type'] = "pipeTrunkLine"
                world.current.pipeGeometry.add(trunkGroup)
                const branch = trunk.branches[key]

                for (const key in branch.fixtures) {
                    const branchGroup = new THREE.Group()
                    branchGroup.name = branch.display_name
                    branchGroup.userData['identifier'] = branch.identifier
                    branchGroup.userData['type'] = "pipeBranchLine"
                    trunkGroup.add(branchGroup)
                    const fixture = branch.fixtures[key]

                    for (const key in fixture.segments) {
                        const segment = fixture.segments[key]
                        const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                        const fl = new LineSegments2(seg, appMaterials.pipeLine);
                        fl.name = fixture.display_name
                        fl.userData['identifier'] = fixture.identifier
                        fl.userData['type'] = "pipeSegmentLine"
                        branchGroup.add(fl);
                    }
                }
            }
        }

        // -- Recirculation piping ------------------------------------------------------
        for (const key in hw_system.recirc_piping) {
            const fixture = hw_system.recirc_piping[key]
            for (const key in fixture.segments) {
                const segment = fixture.segments[key]
                const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                const fl = new LineSegments2(seg, appMaterials.pipeLine);
                fl.userData['identifier'] = fixture.identifier
                fl.userData['type'] = "pipeSegmentLine"
                world.current.pipeGeometry.add(fl);
            }
        }
    });
    world.current.pipeGeometry.visible = false;
}