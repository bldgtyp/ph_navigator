import { hbPhHvacHotWaterSystem } from "../types/honeybee_phhvac/hot_water_system";
import { SceneSetup } from '../scene/SceneSetup';
import { convertLBTLineSegment3DtoLine } from '../to_three_geometry/ladybug_geometry/geometry3d/line';
import { appMaterials } from '../scene/Materials';
import { hbPhHvacPipeTrunk } from '../types/honeybee_phhvac/hot_water_piping';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';

export function loadModelHotWaterPiping(world: React.MutableRefObject<SceneSetup>, data: hbPhHvacHotWaterSystem[]) {
    data.forEach((hw_system) => {
        for (const key in hw_system.distribution_piping) {
            const trunk: hbPhHvacPipeTrunk = hw_system.distribution_piping[key];
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
}