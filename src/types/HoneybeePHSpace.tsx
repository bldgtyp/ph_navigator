import { lbtFace3D, lbtMesh3D } from './LadybugGeometry';

type HoneybeePhSpaceVolume = {
    identifier: string;
    display_name: string;
    avg_ceiling_height: number;
    floor: any;
    geometry: lbtFace3D[];
    mesh?: lbtMesh3D[];
};

export type HoneybeePHSpace = {
    identifier: string;
    name: string;
    number: number;
    quantity: number;
    wufi_type: number;
    volumes: HoneybeePhSpaceVolume[];
    properties: any;
};