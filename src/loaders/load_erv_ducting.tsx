import { SceneSetup } from '../scene/SceneSetup';
import { convertLBTLineSegment3DtoLine } from '../to_three_geometry/ladybug_geometry/geometry3d/line';
import { appMaterials } from '../scene/Materials';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { hbPhHvacVentilationSystem } from '../types/honeybee_phhvac/ventilation';

export function loadModelERVDucting(
    world: React.MutableRefObject<SceneSetup>,
    data: hbPhHvacVentilationSystem[]
) {
    data.forEach((erv_system) => {
        erv_system.supply_ducting.forEach((duct) => {
            for (const key in duct.segments) {
                const segment = duct.segments[key]
                const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                const fl = new LineSegments2(seg, appMaterials.ductLine);
                world.current.ventilationGeometry.add(fl);
            }
        })
        erv_system.exhaust_ducting.forEach((duct) => {
            for (const key in duct.segments) {
                const segment = duct.segments[key]
                const seg = convertLBTLineSegment3DtoLine(segment.geometry, false)
                const fl = new LineSegments2(seg, appMaterials.ductLine);
                world.current.ventilationGeometry.add(fl);
            }
        })
    });
    world.current.ventilationGeometry.visible = false;
}