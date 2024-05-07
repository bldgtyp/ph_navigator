import { lbtLineSegment3D } from "./ladybug_geometry/geometry3d/line";

type PhHvacPipeSegment = {
    geometry: lbtLineSegment3D
    diameter_value: string
    insulation_thickness: number
    insulation_conductivity: number
    insulation_reflective: boolean
    insulation_quality: any
    daily_period: number
    water_temp: number
    material_value: string
}

export type PhHvacPipeElement = {
    identifier: string;
    display_name: string;
    user_data: Object;
    segments: { [key: string]: PhHvacPipeSegment };
}