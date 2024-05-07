import { SceneSetup } from '../scene/SceneSetup';
import { convertLBTFace3DToMesh } from '../to_three_geometry/ladybug_geometry/geometry3d/face';
import { appMaterials } from '../scene/Materials';
import { hbShadeGroup } from '../hooks/fetchModelShades';

export function loadModelShades(
    world: React.MutableRefObject<SceneSetup>,
    data: hbShadeGroup[]
) {
    for (const key in data) {
        const gr = data[key]
        for (const key in gr) {
            const lbtFace3D = gr[key]
            const geom = convertLBTFace3DToMesh(lbtFace3D.geometry)
            geom.mesh.material = appMaterials.geometryShadingMaterial;
            world.current.shadingGeometry.add(geom.mesh);
            world.current.shadingGeometry.visible = false;
            world.current.shadingGeometry.castShadow = false;
        }
    }
}