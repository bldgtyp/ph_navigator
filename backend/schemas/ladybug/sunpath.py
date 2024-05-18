# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: ladybug.sunpath.SunPath"""

from pydantic import BaseModel

from backend.schemas.ladybug.compass import CompassSchema
from backend.schemas.ladybug_geometry.geometry3d.arc import Arc3D
from backend.schemas.ladybug_geometry.geometry3d.polyline import Polyline3D


class SunPathSchema(BaseModel):
    hourly_analemma_polyline3d: list[Polyline3D] = []
    monthly_day_arc3d: list[Arc3D] = []


class SunPathAndCompassDTOSchema(BaseModel):
    sunpath: SunPathSchema
    compass: CompassSchema
