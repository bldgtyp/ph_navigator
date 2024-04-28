
type LadybugPoint3D = [number, number, number];

type LadybugVector3D = [number, number, number];

type LadybugPlane = {
    type: string,
    n: LadybugVector3D,
    o: LadybugPoint3D,
    x: LadybugVector3D,
}

type LadybugMesh = {
    type: string,
    faces: number[],
    vertices: LadybugPoint3D[],
};

type LadybugFace3D = {
    type: string,
    boundary: LadybugPoint3D[],
    plane: LadybugPlane,
    mesh: LadybugMesh,
    area: number,
}

export type HoneybeeFace3D = {
    type: string,
    face_type: string,
    identifier: string,
    display_name: string,
    geometry: LadybugFace3D
    // boundary_condition: any,
    // apertures: any[],
    // doors: any[],
    // indoor_shades: any[],
    // outdoor_shades: any[],
    // properties: any,
    // user_data: any,
};