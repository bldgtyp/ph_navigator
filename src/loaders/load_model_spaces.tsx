import { convertLBTFace3DToMesh } from '../to_three_geometry/ladybug_geometry/geometry3d/face';
import { appMaterials } from '../scene/Materials';
import { hbPHSpace } from "../types/honeybee_ph/space";
import { SceneSetup } from '../scene/SceneSetup';


export function loadModelSpaces(world: React.MutableRefObject<SceneSetup>, hbPHSpaces: hbPHSpace[]) {
    hbPHSpaces.forEach(space => {
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
}
