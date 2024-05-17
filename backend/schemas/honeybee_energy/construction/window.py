from pydantic import BaseModel


class ApertureConstructionSchema(BaseModel):
    identifier: str
    type: str
    r_factor: float = 0.0
    u_factor: float = 0.0
