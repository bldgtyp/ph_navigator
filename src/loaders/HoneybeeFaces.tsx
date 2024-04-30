import * as THREE from 'three';
import { appMaterials } from '../scene/Materials';
import { HoneybeeFace3D, HoneybeeAperture } from '../types/HoneybeeFace3D';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function convertHBFaceToMesh(face: HoneybeeFace3D | HoneybeeAperture): { mesh: THREE.Mesh, wireframe: THREE.LineLoop, vertices: THREE.Points } {
    // ------------------------------------------------------------------------
    // Build up the Surface Mesh
    const vertices: THREE.Vector3[] = [];
    face.geometry.mesh.vertices.forEach((point: any) => {
        const vertex = new THREE.Vector3(point[0], point[1], point[2]);
        vertices.push(vertex);
    });

    // Create a new BufferGeometry to hold the mesh
    const buffGeometry = new THREE.BufferGeometry();

    // Convert LadybugMesh vertices array to a flattened Float32Array
    const vertSize = 3; // X, Y, Z
    const verticesArray = new Float32Array(vertices.length * vertSize);
    for (var i = 0; i < vertices.length; i++) {
        vertices[i].toArray(verticesArray, i * vertSize);
    }

    // Set vertices attribute  
    buffGeometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, vertSize));

    // Define faces using vertex indices
    buffGeometry.setIndex(face.geometry.mesh.faces.flat());

    // Be sure to set the surface normals, otherwise it won't render correctly
    buffGeometry.computeVertexNormals();

    // Create Surface Mesh
    const threeMesh = new THREE.Mesh(buffGeometry, face.face_type === 'Aperture' ? appMaterials.geometryWindowMaterial : appMaterials.geometryStandardMaterial);
    threeMesh.castShadow = true;
    threeMesh.geometry.computeBoundingBox();

    // Add the HB-Face properties to the Mesh's user-data
    threeMesh.userData['display_name'] = face.display_name;
    threeMesh.userData['identifier'] = face.identifier;
    threeMesh.userData['face_type'] = face.face_type;
    threeMesh.userData['type'] = face.type;
    threeMesh.userData['area'] = face.geometry.area;
    threeMesh.userData['boundary_condition'] = face.boundary_condition;
    threeMesh.userData['properties'] = {
        energy: {
            construction: {
                identifier: face.properties.energy.construction.identifier,
                r_factor: face.properties.energy.construction.r_factor,
                u_factor: face.properties.energy.construction.u_factor,
            }
        }
    };

    // ------------------------------------------------------------------------
    // Build up the Wireframe Boundary
    const boundaryVertices: THREE.Vector3[] = [];
    face.geometry.boundary.forEach((point: any) => {
        const vertex = new THREE.Vector3(point[0], point[1], point[2]);
        boundaryVertices.push(vertex);
    });

    // Close the loop by duplicating the first point
    boundaryVertices.push(boundaryVertices[0].clone());

    // Create the Outline from the boundary Points
    const wireframeGeometry = new THREE.BufferGeometry().setFromPoints(boundaryVertices);
    const threeWireframe = new THREE.LineLoop(wireframeGeometry, appMaterials.wireframeMaterial);
    threeWireframe.renderOrder = 1; // Ensure wireframe is rendered behind the surface

    // ------------------------------------------------------------------------
    // Vertices as Points
    var verticesGeometry = new THREE.BufferGeometry().setFromPoints(boundaryVertices);
    verticesGeometry.deleteAttribute('normal');
    verticesGeometry.deleteAttribute('uv');
    verticesGeometry = mergeVertices(verticesGeometry);
    const positionAttribute = verticesGeometry.getAttribute('position');
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', positionAttribute);
    const particles = new THREE.Points(particleGeometry);

    // ------------------------------------------------------------------------
    return { mesh: threeMesh, wireframe: threeWireframe, vertices: particles };
}