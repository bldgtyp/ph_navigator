import { lbtPolyline3D } from "./ladybug_geometry/geometry3d/polyline";
import { lbtLineSegment2D } from "./ladybug_geometry/geometry2d/line";
import { lbtArc3D } from "./ladybug_geometry/geometry3d/arc";
import { lbtArc2D } from "./ladybug_geometry/geometry2d/arc";
import { lbtPoint3D } from "./ladybug_geometry/geometry3d/pointvector";

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

