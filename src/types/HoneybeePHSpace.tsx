import { lbtFace3D } from "./ladybug_geometry/geometry3d/face";
import { lbtMesh3D } from "./ladybug_geometry/geometry3d/mesh";

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