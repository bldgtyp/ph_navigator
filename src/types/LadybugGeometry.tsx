

export type lbtPoint3D = [number, number, number];

export type lbtPoint2D = [number, number];

export type lbtVector3D = [number, number, number];

export type lbtVector2D = [number, number];

export type lbtPlane = {
    type: string,
    n: lbtVector3D,
    o: lbtPoint3D,
    x: lbtVector3D,
}

export type lbtArc3D = {
    type: string,
    plane: lbtPlane,
    radius: number,
    a1: number,
    a2: number,
}

export type lbtArc2D = {
    type: string,
    c: lbtPoint2D,
    r: number,
    a1: number,
    a2: number,

}

export type lbtLineSegment3D = {
    p: lbtPoint3D,
    v: lbtVector3D,
}

export type lbtLineSegment2D = {
    p: lbtPoint2D,
    v: lbtVector2D,
}

export type lbtPolyline3D = {
    type: string,
    vertices: any[],
    interpolated: boolean,
}

export type lbtMesh3D = {
    type: string,
    faces: number[],
    vertices: lbtPoint3D[],
};

export type lbtFace3D = {
    type: string,
    boundary: lbtPoint3D[],
    plane: lbtPlane,
    mesh: lbtMesh3D,
    area: number,
}