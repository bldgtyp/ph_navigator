# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: honeybee_energy.properties.window.WindowConstruction"""

from pydantic import BaseModel

from backend.schemas.honeybee_energy.construction.window import WindowConstructionSchema


class ApertureEnergyPropertiesSchema(BaseModel):
    construction: WindowConstructionSchema | None = None
