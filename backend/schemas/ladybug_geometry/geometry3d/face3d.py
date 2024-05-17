from pydantic import BaseModel
from backend.schemas.ladybug_geometry.geometry3d.mesh3d import Mesh3DSchema
from backend.schemas.ladybug_geometry.geometry3d.plane import PlaneSchema


class Face3DSchema(BaseModel):
    boundary: list[list[float]]
    plane: PlaneSchema
    mesh: Mesh3DSchema | None = None
    area: float | None = None
