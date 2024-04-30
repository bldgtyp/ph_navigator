import { lbtFace3D } from "./LadybugGeometry";

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
    geometry: lbtFace3D,
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
    geometry: lbtFace3D
    boundary_condition: HoneybeeBoundaryCondition,
    apertures: HoneybeeAperture[],
    // doors: any[],
    // indoor_shades: any[],
    // outdoor_shades: any[],
    properties: HoneybeeFaceProperties,
    // user_data: any,
};