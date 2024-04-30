import { lbtPolyline3D, lbtArc3D, lbtPoint3D, lbtArc2D, lbtLineSegment2D } from "./LadybugGeometry";

type LadyBugCompass = {
    radius: number
    center: lbtPoint3D
    north_angle: number
    spacing_factor: number
    all_boundary_circles: lbtArc2D[]
    major_azimuth_ticks: lbtLineSegment2D[]
    minor_azimuth_ticks: lbtLineSegment2D[]
}

export type LadyBugSunPath = {
    hourly_analemma_polyline3d: lbtPolyline3D[],
    monthly_day_arc3d: lbtArc3D[],
    compass: LadyBugCompass
};

