import * as THREE from 'three';
import { convertLBTFace3DToMesh } from '../to_three_geometry/ladybug_geometry/geometry3d/face';
import { appMaterials } from '../scene/Materials';
import { hbPhSpace } from "../types/honeybee_ph/space";
import { SceneSetup } from '../scene/SceneSetup';

function groupFromSpace(space: hbPhSpace) {
    const newGroup = new THREE.Group
    newGroup.castShadow = false;
    newGroup.name = space.name;
    newGroup.userData["identifier"] = space.identifier;
    newGroup.userData["display_name"] = space.name;
    newGroup.userData["number"] = space.number;
    newGroup.userData["net_volume"] = space.net_volume;
    newGroup.userData["avg_clear_height"] = space.avg_clear_height;
    newGroup.userData["floor_area"] = space.floor_area;
    newGroup.userData["weighted_floor_area"] = space.weighted_floor_area;
    newGroup.userData["average_floor_weighting_factor"] = space.average_floor_weighting_factor;
    newGroup.userData["type"] = "spaceGroup";
    return newGroup
}

export function loadSpaceFloors(world: React.MutableRefObject<SceneSetup>, hbPHSpaces: hbPhSpace[]) {
    world.current.spaceFloorGeometryMeshes.visible = false;
    world.current.spaceFloorGeometryMeshes.castShadow = false;
    world.current.spaceFloorGeometryOutlines.visible = false;
    world.current.spaceFloorGeometryOutlines.castShadow = false;
    world.current.spaceFloorGeometryVertices.visible = false;
    world.current.spaceFloorGeometryVertices.castShadow = false;

    hbPHSpaces.forEach(space => {
        const spaceFloorMeshesGroup = groupFromSpace(space)
        const spaceFloorOutlinesGroup = groupFromSpace(space)
        const spaceFloorVerticesGroup = groupFromSpace(space)

        space.volumes.forEach(volume => {
            volume.floor.floor_segments.forEach(segment => {
                if (segment.geometry === null) { return null }

                const geom = convertLBTFace3DToMesh(segment.geometry)
                if (!geom) { return null }

                geom.mesh.material = appMaterials.geometryStandard;
                geom.mesh.castShadow = false;
                geom.mesh.userData["type"] = "spaceFloorSegmentMeshFace";
                geom.wireframe.material = appMaterials.wireframe;
                geom.wireframe.userData["type"] = "spaceFloorSegmentMeshFaceWireframe";

                spaceFloorMeshesGroup.add(geom.mesh);
                spaceFloorOutlinesGroup.add(geom.wireframe);
                spaceFloorVerticesGroup.add(geom.vertices);

            });
        });

        world.current.spaceFloorGeometryMeshes.add(spaceFloorMeshesGroup);
        world.current.spaceFloorGeometryOutlines.add(spaceFloorOutlinesGroup);
        world.current.spaceFloorGeometryVertices.add(spaceFloorVerticesGroup);
    });

}
