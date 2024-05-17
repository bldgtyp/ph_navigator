from pydantic import BaseModel


class BoundaryConditionSchema(BaseModel):
    type: str
