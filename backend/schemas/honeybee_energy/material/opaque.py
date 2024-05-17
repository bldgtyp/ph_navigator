from pydantic import BaseModel


class EnergyOpaqueMaterialSchema(BaseModel):
    type: str
    thickness: float
    conductivity: float
    specific_heat: float
    roughness: str
    visible_absorptance: float
    thermal_absorptance: float
    solar_absorptance: float
    density: float
