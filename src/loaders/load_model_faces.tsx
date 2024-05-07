import { convertHBFaceToMesh } from '../to_three_geometry/honeybee/face';
import { appMaterials } from '../scene/Materials';
import { hbFace } from "../types/honeybee/face";
import { SceneSetup } from '../scene/SceneSetup';


export function loadModelFaces(world: React.MutableRefObject<SceneSetup>, hbFaces: hbFace[]) {
    hbFaces.forEach(face => {
        const geom = convertHBFaceToMesh(face)
        geom.mesh.material = appMaterials.geometryStandardMaterial
        geom.mesh.visible = true
        world.current.buildingGeometryMeshes.add(geom.mesh)

        geom.vertexHelper.visible = true
        world.current.buildingGeometryMeshes.add(geom.vertexHelper)

        geom.wireframe.material = appMaterials.wireframeMaterial
        geom.wireframe.visible = true
        world.current.buildingGeometryOutlines.add(geom.wireframe)

        geom.vertices.visible = false
        world.current.buildingGeometryVertices.add(geom.vertices)

        face.apertures.forEach(aperture => {
            const apertureGeom = convertHBFaceToMesh(aperture)
            apertureGeom.mesh.material = appMaterials.geometryWindowMaterial
            apertureGeom.mesh.visible = true
            world.current.buildingGeometryMeshes.add(apertureGeom.mesh)

            apertureGeom.vertexHelper.visible = true
            world.current.buildingGeometryMeshes.add(apertureGeom.vertexHelper)

            apertureGeom.wireframe.material = appMaterials.wireframeMaterial
            apertureGeom.wireframe.visible = true
            world.current.buildingGeometryOutlines.add(apertureGeom.wireframe)

            apertureGeom.vertices.visible = false
            world.current.buildingGeometryVertices.add(apertureGeom.vertices)
        });
    });
}
