from pydantic import BaseModel
from backend.schemas.honeybee_energy.material.opaque import EnergyOpaqueMaterialSchema


class EnergyOpaqueConstructionSchema(BaseModel):
    identifier: str
    type: str
    r_factor: float = 0.0
    u_factor: float = 0.0
    materials: list[EnergyOpaqueMaterialSchema]
