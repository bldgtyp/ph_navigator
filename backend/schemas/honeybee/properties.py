from pydantic import BaseModel
from backend.schemas.honeybee_energy.properties.face import FaceEnergyPropertiesSchema
from backend.schemas.honeybee_energy.properties.aperture import ApertureEnergyPropertiesSchema


class FacePropertiesSchema(BaseModel):
    energy: FaceEnergyPropertiesSchema


class AperturePropertiesSchema(BaseModel):
    energy: ApertureEnergyPropertiesSchema
