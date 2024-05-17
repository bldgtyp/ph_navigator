from pydantic import BaseModel


class Mesh3DSchema(BaseModel):
    vertices: list[list[float]]
    faces: list[list[int]]
