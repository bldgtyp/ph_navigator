# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: honeybee.face.Face"""


from pydantic.main import BaseModel

from backend.schemas.honeybee.aperture import ApertureSchema
from backend.schemas.honeybee.boundarycondition import BoundaryConditionSchema
from backend.schemas.honeybee.properties import FacePropertiesSchema
from backend.schemas.ladybug_geometry.geometry3d.face3d import Face3DSchema


class FaceSchema(BaseModel):
    type: str
    identifier: str
    face_type: str
    display_name: str
    geometry: Face3DSchema
    boundary_condition: BoundaryConditionSchema
    apertures: list[ApertureSchema] = []
    properties: FacePropertiesSchema
