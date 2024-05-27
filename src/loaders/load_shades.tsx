import { SceneSetup } from '../scene/SceneSetup';
import { convertLBTFace3DToMesh } from '../to_three_geometry/ladybug_geometry/geometry3d/face';
import { appMaterials } from '../scene/Materials';
import { hbShadeGroup } from '../types/honeybee/shade';

export function loadShades(
    world: React.MutableRefObject<SceneSetup>,
    data: hbShadeGroup[]
) {
    data.forEach((shadeGroup) => {
        shadeGroup.shades.forEach((shade) => {
            const geom = convertLBTFace3DToMesh(shade.geometry)
            if (!geom) { return null }

            geom.mesh.material = appMaterials.geometryShading;
            world.current.shadingGeometry.add(geom.mesh);
            world.current.shadingGeometry.visible = false;
            world.current.shadingGeometry.castShadow = false;
        })
    });
}