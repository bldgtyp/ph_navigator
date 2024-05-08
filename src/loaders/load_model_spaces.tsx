import * as THREE from 'three';
import { convertLBTFace3DToMesh } from '../to_three_geometry/ladybug_geometry/geometry3d/face';
import { appMaterials } from '../scene/Materials';
import { hbPHSpace } from "../types/honeybee_ph/space";
import { SceneSetup } from '../scene/SceneSetup';

function groupFromSpace(space: hbPHSpace) {
    const newGroup = new THREE.Group
    newGroup.name = space.name;
    newGroup.userData["identifier"] = space.identifier;
    newGroup.userData["display_name"] = space.name;
    newGroup.userData["number"] = space.number;
    newGroup.userData["type"] = "spaceGroup";
    return newGroup
}

export function loadModelSpaces(world: React.MutableRefObject<SceneSetup>, hbPHSpaces: hbPHSpace[]) {
    world.current.spaceGeometryMeshes.visible = false;
    world.current.spaceGeometryMeshes.castShadow = false;
    world.current.spaceGeometryOutlines.visible = false;
    world.current.spaceGeometryOutlines.castShadow = false;
    world.current.spaceGeometryVertices.visible = false;
    world.current.spaceGeometryVertices.castShadow = false;

    hbPHSpaces.forEach(space => {
        const spaceMeshesGroup = groupFromSpace(space)
        const spaceOutlinesGroup = groupFromSpace(space)
        const spaceVerticesGroup = groupFromSpace(space)

        space.volumes.forEach(volume => {
            volume.geometry.forEach(lbtFace3D => {
                const geom = convertLBTFace3DToMesh(lbtFace3D)
                geom.mesh.material = appMaterials.geometryStandardMaterial;
                geom.mesh.userData["type"] = "spaceMeshFace";
                geom.wireframe.material = appMaterials.wireframeMaterial;
                geom.wireframe.userData["type"] = "spaceMeshFaceWireframe";

                spaceMeshesGroup.add(geom.mesh);
                spaceOutlinesGroup.add(geom.wireframe);
                spaceVerticesGroup.add(geom.vertices);
            });
        });

        world.current.spaceGeometryMeshes.add(spaceMeshesGroup);
        world.current.spaceGeometryOutlines.add(spaceOutlinesGroup);
        world.current.spaceGeometryVertices.add(spaceVerticesGroup);
    });
}
