from pydantic import BaseModel
from backend.schemas.ladybug_geometry.geometry3d.face3d import Face3DSchema
from backend.schemas.honeybee.properties import AperturePropertiesSchema
from backend.schemas.honeybee.boundarycondition import BoundaryConditionSchema


class ApertureSchema(BaseModel):
    identifier: str
    display_name: str
    geometry: Face3DSchema
    face_type: str = "Aperture"
    boundary_condition: BoundaryConditionSchema
    properties: AperturePropertiesSchema
