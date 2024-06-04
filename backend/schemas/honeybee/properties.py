# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: honeybee.properties"""


from pydantic.main import BaseModel

from backend.schemas.honeybee_energy.properties.aperture import ApertureEnergyPropertiesSchema
from backend.schemas.honeybee_energy.properties.face import FaceEnergyPropertiesSchema


class FacePropertiesSchema(BaseModel):
    energy: FaceEnergyPropertiesSchema


class AperturePropertiesSchema(BaseModel):
    energy: ApertureEnergyPropertiesSchema
