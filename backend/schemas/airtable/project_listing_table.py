# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic Schema: AirTable | Master Project List"""


from pydantic import BaseModel


class AT_ProjectListingRecordFieldsSchema(BaseModel):
    PROJECT_NUMBER: str
    PROJECT_NAME: str
    APP_ID: str
    TABLE_ID: str


class AT_ProjectListingRecordSchema(BaseModel):
    id: str
    createdTime: str
    fields: AT_ProjectListingRecordFieldsSchema


class AT_ProjectListingTableSchema(BaseModel):
    """The listing of the Active Projects from AirTable."""

    records: list[AT_ProjectListingRecordSchema]
