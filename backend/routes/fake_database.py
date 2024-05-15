# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for the fake Database."""

import json

from fastapi import APIRouter, File, UploadFile
from fastapi.security import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel

from backend.storage.db import db, generate_random_name

router = APIRouter()


class Project(BaseModel):
    display_name: str


@router.put("/{team_id}/create_new_project")
def create_new_project(team_id: str, project: Project | None = None):
    team = db.get_team_by_name(team_id)
    if not team:
        return {"message": {"error": "No team found with that name."}}

    if not project:
        project_name = generate_random_name("proj")
    else:
        project_name = project.display_name

    ph_nav_project = team.create_new_project(project_name)
    return {
        "message": json.dumps(
            {
                "project_identifier": str(ph_nav_project.identifier),
                "project_id": ph_nav_project.display_name,
            }
        )
    }


@router.put("/{team_id}/{project_id}/create_new_model")
def create_new_model(team_id: str, project_id: str, model_id: str | None = None):
    ph_nav_team = db.get_team_by_name(team_id)
    if not ph_nav_team:
        return {"message": {"error": f"No team found with name: {team_id}."}}

    ph_nav_project = ph_nav_team.get_ph_navigator_project_by_name(project_id)
    if not ph_nav_project:
        return {"message": {"error": f"No project found with name: {project_id}."}}

    if not model_id:
        model_id = generate_random_name("mdl")
        ph_nav_model = ph_nav_project.create_new_model(model_id)
    return {
        "message": json.dumps(
            {
                "model_identifier": str(ph_nav_model.identifier),
                "model_id": ph_nav_model.display_name,
            }
        )
    }


@router.get("/{team_id}/get_project_listing")
def get_project_listing(team_id: str):
    """Return a list of all the Projects with their IDs

    message : [
        {"name":"project_1", "identifier":UUID},
        {"name":"project_2", "identifier":UUID},
        ...
    ]
    """
    return {"message": json.dumps(db.get_projects_by_team_name(team_id))}


@router.get("/{team_id}/{project_id}/get_model_names")
def get_model_names(team_id: str, project_id: str):
    """Return a list of all the Models with their IDs

    message : [
        {"name":"model_1", "identifier":UUID},
        {"name":"model_2", "identifier":UUID},
        ...
    ]
    """
    team = db.get_team_by_name(team_id)
    if not team:
        return {"message": {"error": "No team found with that name."}}

    project = team.get_ph_navigator_project_by_name(project_id)
    if not project:
        return {"message": {"error": "No project found with that ID."}}

    return {"message": json.dumps(project.model_names)}


@router.post("/{team_id}/{project_id}/{model_id}/upload_hbjson_file_to_model")
async def upload_hbjson_file_to_model(
    team_id: str, project_id: str, model_id: str, file: UploadFile | None = File(...)
):
    # -------------------------------------------------------------------------
    if not file:
        return {"message": {"error": "No file provided?"}}

    # -------------------------------------------------------------------------
    filename = file.filename or ""
    if not filename.endswith(".hbjson"):
        return {"message": {"error": "Sorry, only HBJSON files are allowed."}}

    # -------------------------------------------------------------------------
    contents = await file.read()  # Read the contents of the uploaded file as bytes
    json_data: dict = json.loads(contents)  # Decode the bytes to string and parse it as JSON

    # -------------------------------------------------------------------------
    try:
        team = db.get_team_by_name(team_id)
        if not team:
            return {"message": {"error": f"No team found with name: {team_id}."}}

        project = team.get_ph_navigator_project_by_name(project_id)
        if not project:
            return {"message": {"error": f"No project found with name: {project_id}."}}

        project.set_model_hb_json(model_id, json_data)
    except Exception as e:
        return {"message": {"error": str(e)}}

    return {"message": {"success": f"File: '{file.filename}' uploaded successfully."}}
