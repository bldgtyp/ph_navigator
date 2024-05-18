# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for the fake Database."""

import json
from logging import getLogger

from fastapi import APIRouter, File, HTTPException, UploadFile
from PHX.from_HBJSON import read_HBJSON_file

from backend.storage.fake_db import ModelView, Project, _db_new_

router = APIRouter()

logger = getLogger("uvicorn")

# ----------------------------------------------------------------------------------------------------------------------
# -- GET


@router.get("/{team_name}/get_projects", response_model=list[Project])
async def get_projects(team_name: str) -> list[Project]:
    """Return a list of all the Team's Projects"""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")
    return team.projects


@router.get("/{team_name}/{project_name}/get_model_names", response_model=list[str])
async def get_model_names(team_name: str, project_name: str) -> list[str]:
    """Return a list of all the Project's Model's names."""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = await team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    return project.model_view_names


@router.get("/{team_name}/{project_name}/get_model", response_model=ModelView)
async def get_model(team_name: str, project_name: str, model_name: str) -> ModelView:
    """Return a specific Model from a Project"""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = await team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    model = await project.get_model_view_by_name(model_name)
    if not model:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no model found with the name: '{model_name}'")

    logger.info(f"Returning model: {model.dict()}")
    return model


# ----------------------------------------------------------------------------------------------------------------------
# -- CREATE


@router.get("/{team_name}/create_new_project", response_model=Project)
async def create_new_project(team_name: str) -> Project:
    """Create a new Project for a Team"""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    new_project = Project()
    new_project.display_name = new_project.identifier
    await team.add_project(new_project)
    return new_project


@router.get("/{team_name}/{project_name}/create_new_model_view", response_model=Project)
async def create_new_model_view(team_name: str, project_name: str) -> ModelView:
    """Create a new ModelView for a Project"""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = await team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    new_model_view = ModelView()
    new_model_view.display_name = new_model_view.identifier
    await project.add_model_view(new_model_view)
    return new_model_view


# ----------------------------------------------------------------------------------------------------------------------
# -- PUT


@router.put("/{team_name}/add_new_project_to_team", response_model=Project)
async def add_new_project_to_team(team_name: str, project: Project) -> Project:
    """Add a new Project to a Team"""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    logger.info(f"Creating a new project with name: '{project.display_name}' for team: '{team_name}'")
    await team.add_project(project)
    return project


@router.put("/{team_name}/{project_name}/add_new_model_to_project", response_model=ModelView)
async def add_new_model_to_project(team_name: str, project_name: str, model: ModelView) -> ModelView:
    """Add a new Model to a Project"""
    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = await team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    logger.info(f"Creating a new model with name: '{model.display_name}' for project: '{project_name}'")
    await project.add_model_view(model)
    return model


# ----------------------------------------------------------------------------------------------------------------------
# -- POST


@router.post("/{team_name}/{project_name}/{model_name}/upload_hbjson_file_to_model")
async def upload_hbjson_file_to_model(
    team_name: str, project_name: str, model_name: str, file: UploadFile | None = File(...)
):
    logger.info(f"Uploading HBJSON file to Model: '{model_name}' in Project: '{project_name}' for Team: '{team_name}'")
    # -------------------------------------------------------------------------
    if not file:
        return {"error": "No file provided?"}

    # -------------------------------------------------------------------------
    filename = file.filename or ""
    if not filename.endswith(".hbjson"):
        return {"error": "Sorry, only HBJSON files are allowed."}

    # -------------------------------------------------------------------------
    contents = await file.read()  # Read the contents of the uploaded file as bytes
    json_data: dict = json.loads(contents)  # Decode the bytes to string and parse it as JSON

    # -------------------------------------------------------------------------
    try:
        team = await _db_new_.get_team_by_name(team_name)
        if not team:
            raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

        project = await team.get_project_by_name(project_name)
        if not project:
            raise HTTPException(
                status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
            )

        model_view = await project.get_model_view_by_name(model_name)
        if not model_view:
            raise HTTPException(
                status_code=404, detail=f"Sorry, there was no model found with the name: '{model_name}'"
            )

        logger.info(f"Updating model: '{model_name}' in project: '{project_name}' for team: '{team_name}'")
        model_view._hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(json_data)

    except Exception as e:
        return {"error": str(e)}

    return {"success": f"File: '{file.filename}' uploaded successfully."}
