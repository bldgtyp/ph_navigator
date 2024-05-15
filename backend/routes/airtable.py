# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for Airtable API."""

import json
import os

from fastapi import APIRouter
from pyairtable import Api
from pyairtable.api.types import RecordDict

from backend.storage.db import db

router = APIRouter()


@router.get("/{team_id}/{project_id}/{model_id}/cert_results/{result_type}")
def get_certification_results(team_id: str, project_id: str, model_id: str):
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}
    api = Api(os.environ["PH_VIEW_GET"])
    # table = api.table(proj.airtable_base_id, proj.airtable_ids["cert_results"])
    # data = table.all()
    # return data

    return None
