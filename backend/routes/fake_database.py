# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for the fake Database."""

import json
from logging import getLogger

from rich import print
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel

# from backend.storage.db import db, generate_random_name
from backend.storage.db_new import Project, ModelView, _db_new_, generate_identifier

router = APIRouter()

logger = getLogger("uvicorn")

# ----------------------------------------------------------------------------------------------------------------------
# -- GET


@router.get("/{team_name}/get_projects", response_model=list[Project])
def get_projects(team_name: str) -> list[Project]:
    """Return a list of all the Team's Projects"""
    team = _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")
    return team.projects


@router.get("/{team_name}/{project_name}/get_model_names", response_model=list[str])
def get_model_names(team_name: str, project_name: str) -> list[str]:
    """Return a list of all the Project's Model's names."""
    team = _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    return project.model_view_names


# ----------------------------------------------------------------------------------------------------------------------
# -- PUT


@router.put("/{team_name}/add_new_project_to_team", response_model=Project)
def add_new_project_to_team(team_name: str, project: Project) -> Project:
    """Add a new Project to a Team"""
    team = _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    logger.info(f"Creating a new project with name: '{project.display_name}' for team: '{team_name}'")
    team.add_project(project)
    return project


@router.put("/{team_name}/{project_name}/add_new_model_to_project", response_model=ModelView)
def add_new_model_to_project(team_name: str, project_name: str, model: ModelView) -> ModelView:
    """Add a new Model to a Project"""
    team = _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    logger.info(f"Creating a new model with name: '{model.display_name}' for project: '{project_name}'")
    project.add_model_view(model)
    return model


# ----------------------------------------------------------------------------------------------------------------------
# -- OLD ONES:

# @router.post("/{team_id}/{project_id}/{model_id}/upload_hbjson_file_to_model")
# async def upload_hbjson_file_to_model(
#     team_id: str, project_id: str, model_id: str, file: UploadFile | None = File(...)
# ):
#     # -------------------------------------------------------------------------
#     if not file:
#         return {"message": {"error": "No file provided?"}}

#     # -------------------------------------------------------------------------
#     filename = file.filename or ""
#     if not filename.endswith(".hbjson"):
#         return {"message": {"error": "Sorry, only HBJSON files are allowed."}}

#     # -------------------------------------------------------------------------
#     contents = await file.read()  # Read the contents of the uploaded file as bytes
#     json_data: dict = json.loads(contents)  # Decode the bytes to string and parse it as JSON

#     # -------------------------------------------------------------------------
#     try:
#         team = db.get_team_by_name(team_id)
#         if not team:
#             return {"message": {"error": f"No team found with name: {team_id}."}}

#         project = team.get_ph_navigator_project_by_name(project_id)
#         if not project:
#             return {"message": {"error": f"No project found with name: {project_id}."}}

#         project.set_model_hb_json(model_id, json_data)
#     except Exception as e:
#         return {"message": {"error": str(e)}}

#     return {"message": {"success": f"File: '{file.filename}' uploaded successfully."}}
