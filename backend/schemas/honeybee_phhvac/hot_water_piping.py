# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: honeybee_phhvac.hot_water_piping"""

from typing import Any
from pydantic import BaseModel

from backend.schemas.ladybug_geometry.geometry3d.line import LineSegment3DSchema


class PhHvacPipeSegmentSchema(BaseModel):
    geometry: LineSegment3DSchema
    diameter_value: str
    insulation_thickness: str
    insulation_conductivity: float
    insulation_reflective: bool
    insulation_quality: Any
    daily_period: float
    water_temp: float
    material_value: str
    length: float


class PhHvacPipeElementSchema(BaseModel):
    identifier: str
    display_name: str
    user_data: dict
    segments: dict[str, PhHvacPipeSegmentSchema]


class PhHvacPipeBranchSchema(BaseModel):
    identifier: str
    display_name: str
    user_data: dict
    pipe_element: PhHvacPipeElementSchema
    fixtures: dict[str, PhHvacPipeElementSchema]


class PhHvacPipeTrunkSchema(BaseModel):
    identifier: str
    display_name: str
    user_data: dict
    pipe_element: PhHvacPipeElementSchema
    branches: dict[str, PhHvacPipeBranchSchema]
    multiplier: float
