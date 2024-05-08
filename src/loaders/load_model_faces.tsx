import { convertHBFaceToMesh } from '../to_three_geometry/honeybee/face';
import { appMaterials } from '../scene/Materials';
import { hbFace } from "../types/honeybee/face";
import { SceneSetup } from '../scene/SceneSetup';


export function loadModelFaces(world: React.MutableRefObject<SceneSetup>, hbFaces: hbFace[]) {
    hbFaces.forEach(face => {
        const geom = convertHBFaceToMesh(face)
        geom.mesh.name = face.display_name
        geom.mesh.userData["type"] = "faceMesh"
        geom.mesh.material = appMaterials.geometryStandard
        geom.mesh.visible = true
        world.current.buildingGeometryMeshes.add(geom.mesh)

        geom.vertexHelper.name = face.display_name
        geom.vertexHelper.userData["type"] = "faceMeshVertexHelper"
        geom.vertexHelper.visible = true
        world.current.buildingGeometryMeshes.add(geom.vertexHelper)

        geom.wireframe.name = face.display_name
        geom.wireframe.userData["type"] = "faceMeshWireframe"
        geom.wireframe.material = appMaterials.wireframe
        geom.wireframe.visible = true
        world.current.buildingGeometryOutlines.add(geom.wireframe)

        geom.vertices.visible = false
        world.current.buildingGeometryVertices.add(geom.vertices)

        face.apertures.forEach(aperture => {
            const apertureGeom = convertHBFaceToMesh(aperture)
            apertureGeom.mesh.name = face.display_name
            apertureGeom.mesh.userData["type"] = "apertureMeshFace"
            apertureGeom.mesh.material = appMaterials.geometryWindow
            apertureGeom.mesh.visible = true
            world.current.buildingGeometryMeshes.add(apertureGeom.mesh)

            apertureGeom.vertexHelper.name = face.display_name
            apertureGeom.vertexHelper.userData["type"] = "apertureMeshFaceVertexHelper"
            apertureGeom.vertexHelper.visible = true
            world.current.buildingGeometryMeshes.add(apertureGeom.vertexHelper)

            apertureGeom.wireframe.name = face.display_name
            apertureGeom.wireframe.userData["type"] = "apertureMeshFaceWireframe"
            apertureGeom.wireframe.material = appMaterials.wireframe
            apertureGeom.wireframe.visible = true
            world.current.buildingGeometryOutlines.add(apertureGeom.wireframe)

            apertureGeom.vertices.visible = false
            world.current.buildingGeometryVertices.add(apertureGeom.vertices)
        });
    });
}
