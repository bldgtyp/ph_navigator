import * as THREE from 'three';
import { hbAperture } from "../types/honeybee/aperture";
import { hbFace } from "../types/honeybee/face";
import { convertLBTFace3DToMesh } from './LadybugFace3D';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';


export function convertHBFaceToMesh(face: hbFace | hbAperture): { mesh: THREE.Mesh, wireframe: THREE.LineLoop, vertices: THREE.Points, vertexHelper: VertexNormalsHelper } {
    // ------------------------------------------------------------------------
    // Build the Surface geometry elements
    const lbtFace3D = face.geometry
    const mesh = convertLBTFace3DToMesh(lbtFace3D)

    // -- Add the HB-Face properties to the Mesh's user-data
    mesh.mesh.userData['display_name'] = face.display_name;
    mesh.mesh.userData['identifier'] = face.identifier;
    mesh.mesh.userData['face_type'] = face.face_type;
    mesh.mesh.userData['type'] = face.type;
    mesh.mesh.userData['area'] = face.geometry.area;
    mesh.mesh.userData['boundary_condition'] = face.boundary_condition;
    mesh.mesh.userData['properties'] = {
        energy: {
            construction: {
                identifier: face.properties.energy.construction.identifier,
                r_factor: face.properties.energy.construction.r_factor,
                u_factor: face.properties.energy.construction.u_factor,
            }
        }
    };

    // ------------------------------------------------------------------------
    return mesh
}