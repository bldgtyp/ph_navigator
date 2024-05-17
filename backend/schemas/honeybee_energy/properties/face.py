from pydantic import BaseModel
from backend.schemas.honeybee_energy.construction.opaque import EnergyOpaqueConstructionSchema


class FaceEnergyPropertiesSchema(BaseModel):
    construction: EnergyOpaqueConstructionSchema | None = None
