# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for Airtable API."""

import json
import logging
import os

from fastapi import APIRouter, Header, HTTPException
import requests
from PHX.from_HBJSON import read_HBJSON_file
from pyairtable import Api
from requests.exceptions import HTTPError

from backend.storage.fake_db import ModelView, _db_new_
from backend.schemas.airtable.project_listing_table import AT_ProjectListingTableSchema
from backend.schemas.airtable.project_table import AT_ProjectTableSchema

logger = logging.getLogger("uvicorn")

router = APIRouter()

# ---------------------------------------------------------------------------------------
# --- Project Data Listing

AT_BLDGTYP_PROJ_LIST_BASE_ID = "appk1jRPHnfZwc8A8"
AT_BLDGTYP_PROJ_LIST_TABLE_ID = "tblm15v0S09KY6wn2"


# ---------------------------------------------------------------------------------------


@router.get("/get_project_metadata_from_source", response_model=AT_ProjectListingTableSchema)
async def get_project_metadata_from_source(token: str = Header(None)):
    """Get the Team's Project metadata (project names, ...) from the Airtable Source Master List."""
    logger.info(f"Route > get_project_metadata_from_source({token})")
    try:
        api = Api(token)
        project_data_table = api.table(AT_BLDGTYP_PROJ_LIST_BASE_ID, AT_BLDGTYP_PROJ_LIST_TABLE_ID)
        table_data = project_data_table.all()
        return AT_ProjectListingTableSchema(records=table_data)
    except HTTPError as e:
        if e.response.status_code == 401:
            logger.error(f"HTTP error: Not Authorized | {e}")
            raise HTTPException(status_code=401, detail="Not authorized")
        else:
            logger.error(f"HTTP error: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_model_metadata_from_source", response_model=AT_ProjectTableSchema)
async def get_model_metadata_from_source(token: str = Header(None), app_id: str = "", tbl_id: str = ""):
    """Get the ModelView metadata (name, url, ...) from the specified Airtable app_id/tbl_id."""
    logger.info(f"Route > get_model_metadata_from_source({app_id}, {tbl_id}, {token})")
    try:
        api = Api(token)
        project_data_table = api.table(app_id, tbl_id)

        # -- Convert all the table records to Pydantic Schema
        table_data = project_data_table.all()
        return AT_ProjectTableSchema(records=table_data)

    except HTTPError as e:
        if e.response.status_code == 401:
            logger.error(f"HTTP error: Not Authorized | {e}")
            raise HTTPException(status_code=401, detail="Not authorized")
        else:
            logger.error(f"HTTP error: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def download_hb_json(url: str) -> dict:
    """Download the HBJSON data from the URL and return the JSON content."""
    logger.info(f"Route > download_hb_json({url})")
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download {url}: {e}")
        raise HTTPException(status_code=404, detail=f"Failed to download from URL: {url} | {e}")
    return response.json()


@router.get("/{team_name}/{project_name}/{model_name}/load_hb_model", response_model=ModelView)
async def load_hb_model(team_name: str, project_name: str, model_name: str) -> ModelView:
    """Load the Honeybee-Model from its source for a specific ModelView."""
    logger.info(f"Route > load_hb_model({team_name} , {project_name} , {model_name})")

    # -- Find the Model in the Database
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"No Team found for: '{team_name}'")

    project = await team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(status_code=404, detail=f"No Project found for: '{project_name}'")

    model_view = await project.get_model_view_by_name(model_name)
    if not model_view:
        raise HTTPException(status_code=404, detail=f"No Model found for: '{model_name}'")

    # -- Ensure the ModelView has it's Honeybee-Model object already loaded.
    # -- If not, try and load it from the source URL
    if model_view._hb_model is not None:
        return model_view
    else:
        if model_view.hbjson_url is None:
            raise HTTPException(
                status_code=404,
                detail=f"No HB-Model loaded for: '{model_name}' and no source URL provided for HBJSON file.",
            )
        else:
            hb_model_dict = download_hb_json(model_view.hbjson_url)
            try:
                hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_model_dict)
            except Exception as e:
                raise HTTPException(
                    status_code=404, detail=f"Failed to read in the HB-Model from URL: '{model_view.hbjson_url}' | {e}"
                )
            model_view._hb_model = hb_model
            return model_view


# @router.get("/{team_id}/{project_id}/{model_id}/cert_results/{result_type}")
# def get_certification_results(team_id: str, project_id: str, model_id: str):
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     api = Api(os.environ["PH_VIEW_GET"])
#     # table = api.table(proj.airtable_base_id, proj.airtable_ids["cert_results"])
#     # data = table.all()
#     # return data

#     return None
