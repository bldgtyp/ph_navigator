from pydantic import BaseModel
from backend.schemas.honeybee_energy.construction.opaque import EnergyOpaqueConstructionSchema
from backend.schemas.honeybee_energy.construction.window import ApertureConstructionSchema


class ApertureEnergyPropertiesSchema(BaseModel):
    construction: ApertureConstructionSchema | None = None
