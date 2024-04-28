
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

type HoneybeeBoundaryCondition = {
    type: string,
}

type HoneybeeApertureConstruction = {
    identifier: string,
    type: string,
    r_factor: number,
    u_factor: number,
}

type HoneybeeApertureFaceEnergyProperties = {
    construction: HoneybeeApertureConstruction
}

type HoneybeeApertureProperties = {
    energy: HoneybeeApertureFaceEnergyProperties
}

export type HoneybeeAperture = {
    type: string,
    identifier: string,
    face_type: string,
    display_name: string,
    geometry: LadybugFace3D,
    boundary_condition: HoneybeeBoundaryCondition,
    properties: HoneybeeApertureProperties,
}

type HoneybeeOpaqueMaterial = {
    type: string,
    thickness: number,
    conductivity: number,
    specific_heat: number,
    roughness: string,
    visible_absorptance: number,
    thermal_absorptance: number,
    solar_absorptance: number,
    density: number,
};

type HoneybeeOpaqueConstruction = {
    identifier: string,
    type: string,
    r_factor: number,
    u_factor: number,
    materials: HoneybeeOpaqueMaterial[]
}

type HoneybeeFaceEnergyProperties = {
    construction: HoneybeeOpaqueConstruction
}

type HoneybeeFaceProperties = {
    energy: HoneybeeFaceEnergyProperties
}

export type HoneybeeFace3D = {
    type: string,
    identifier: string,
    face_type: string,
    display_name: string,
    geometry: LadybugFace3D
    boundary_condition: HoneybeeBoundaryCondition,
    apertures: HoneybeeAperture[],
    // doors: any[],
    // indoor_shades: any[],
    // outdoor_shades: any[],
    properties: HoneybeeFaceProperties,
    // user_data: any,
};