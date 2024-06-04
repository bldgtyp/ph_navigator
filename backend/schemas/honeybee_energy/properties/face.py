# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: honeybee_energy.properties.face.FaceEnergyProperties"""

from pydantic.main import BaseModel

from backend.schemas.honeybee_energy.construction.opaque import OpaqueConstructionSchema


class FaceEnergyPropertiesSchema(BaseModel):
    construction: OpaqueConstructionSchema | None = None
