import { lbtFace3D } from "./ladybug_geometry/geometry3d/face";

export type HoneybeeShadeGroup = {
    [key: string]: HoneybeeShade
}


export type HoneybeeShade = {
    type: string;
    identifier: string;
    display_name: string;
    is_detached: boolean;
    geometry: lbtFace3D
};