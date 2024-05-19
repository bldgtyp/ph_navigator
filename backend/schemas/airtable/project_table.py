# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: AirTable | Project"""

from pydantic import BaseModel


class AT_HBJSONFileSchema(BaseModel):
    id: str
    url: str
    filename: str
    size: int
    type: str


class AT_ProjectFieldsFieldsSchema(BaseModel):
    DATE: str
    DISPLAY_NAME: str
    HBJSON_FILE: list[AT_HBJSONFileSchema]


class AT_ProjectRecordSchema(BaseModel):
    id: str
    createdTime: str
    fields: AT_ProjectFieldsFieldsSchema


class AT_ProjectTableSchema(BaseModel):
    """An individual Project's Data from Airtable."""

    records: list[AT_ProjectRecordSchema]
