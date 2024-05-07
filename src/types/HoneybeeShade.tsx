import { lbtFace3D } from './LadybugGeometry';

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