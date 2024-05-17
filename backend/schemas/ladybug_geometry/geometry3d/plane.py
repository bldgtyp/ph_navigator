from pydantic import BaseModel


class PlaneSchema(BaseModel):
    n: list[float]
    o: list[float]
    x: list[float]
