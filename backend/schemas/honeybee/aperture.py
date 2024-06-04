# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: honeybee.aperture.Aperture"""

from pydantic.main import BaseModel

from backend.schemas.honeybee.boundarycondition import BoundaryConditionSchema
from backend.schemas.honeybee.properties import AperturePropertiesSchema
from backend.schemas.ladybug_geometry.geometry3d.face3d import Face3DSchema


class ApertureSchema(BaseModel):
    identifier: str
    display_name: str
    geometry: Face3DSchema
    face_type: str = "Aperture"
    boundary_condition: BoundaryConditionSchema
    properties: AperturePropertiesSchema
