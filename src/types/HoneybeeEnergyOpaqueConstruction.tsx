type HoneybeeEnergyMaterial = {
    identifier: string;
    type: string;
    conductivity: number;
    density: number;
    properties: any;
    roughness: string;
    solar_absorptance: number;
    specific_heat: number;
    thermal_absorptance: number;
    thickness: number;
    visible_absorptance: number;
}

export type HoneybeeEnergyOpaqueConstruction = {
    identifier: string;
    type: string;
    materials: HoneybeeEnergyMaterial[];
    u_factor: number;
}