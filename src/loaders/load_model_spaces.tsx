import * as THREE from 'three';
import { convertLBTFace3DToMesh } from '../to_three_geometry/ladybug_geometry/geometry3d/face';
import { appMaterials } from '../scene/Materials';
import { hbPHSpace } from "../types/honeybee_ph/space";
import { SceneSetup } from '../scene/SceneSetup';


export function loadModelSpaces(world: React.MutableRefObject<SceneSetup>, hbPHSpaces: hbPHSpace[]) {
    world.current.spaceGeometryMeshes.visible = false;
    world.current.spaceGeometryMeshes.castShadow = false;
    world.current.spaceGeometryOutlines.visible = false;
    world.current.spaceGeometryOutlines.castShadow = false;
    world.current.spaceGeometryVertices.visible = false;
    world.current.spaceGeometryVertices.castShadow = false;

    hbPHSpaces.forEach(space => {
        const spaceMeshesGroup = new THREE.Group
        spaceMeshesGroup.name = space.name;
        const spaceOutlinesGroup = new THREE.Group
        spaceOutlinesGroup.name = space.name;
        const spaceVerticesGroup = new THREE.Group
        spaceVerticesGroup.name = space.name;

        world.current.spaceGeometryMeshes.add(spaceMeshesGroup);
        world.current.spaceGeometryOutlines.add(spaceOutlinesGroup);
        world.current.spaceGeometryVertices.add(spaceVerticesGroup);

        space.volumes.forEach(volume => {
            volume.geometry.forEach(lbtFace3D => {
                const geom = convertLBTFace3DToMesh(lbtFace3D)
                geom.mesh.material = appMaterials.geometryStandardMaterial;
                geom.wireframe.material = appMaterials.wireframeMaterial;

                spaceMeshesGroup.add(geom.mesh);
                spaceOutlinesGroup.add(geom.wireframe);
                spaceVerticesGroup.add(geom.vertices);
            });
        });
    });
}
