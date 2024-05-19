# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for GitHub API."""

from logging import getLogger

import requests
from fastapi import APIRouter, Header, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from PHX.from_HBJSON import read_HBJSON_file
from pydantic import BaseModel

from backend.storage.fake_db import ModelView, _db_new_

logger = getLogger("uvicorn")

router = APIRouter()

# OAuth2 configuration
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://github.com/login/oauth/authorize",
    tokenUrl="https://github.com/login/oauth/access_token",
)


class GitHubPathElement(BaseModel):
    """A GitHub Path-Element representing a file or directory within a GitHub repository."""

    name: str
    path: str
    sha: str
    size: int
    url: str
    html_url: str
    git_url: str
    download_url: str | None
    type: str
    _links: dict[str, str]
    children: list["GitHubPathElement"] = []


# ---------------------------------------------------------------------------------------
# -- Team Project Loader


def walk_github_folders(headers: dict, parent: list[GitHubPathElement], url: str) -> list[GitHubPathElement]:
    """Recursively walk through the GitHub folders and files and return a list of all the GitHubPathElement (dir, file, ...) objects."""
    response = requests.get(url, headers)
    response.raise_for_status()  # Raise exception if invalid response
    for responseData in response.json():
        new_path_object = GitHubPathElement(**responseData)
        if new_path_object.type == "dir":
            new_path_object.children = walk_github_folders(headers, new_path_object.children, new_path_object.url)
        parent.append(new_path_object)
    return parent


fuck_you_github_rate_limits = {"temp": []}


@router.get("/get_team_project_data_from_source", response_model=list[GitHubPathElement])
def get_github_files(token: str = Header(None)) -> list[GitHubPathElement]:
    """Return all the GitHub path elements (dir, file, ...) for the specified URL."""
    if fuck_you_github_rate_limits["temp"] != []:
        logger.info("using cached github data")
        return fuck_you_github_rate_limits["temp"]

    URL = "https://api.github.com/repos/bldgtyp/ph_navigator_data/contents/projects"
    headers = {"Authorization": f"Bearer {token}"}
    github_folder_elements: list[GitHubPathElement] = []
    walk_github_folders(headers, github_folder_elements, URL)
    fuck_you_github_rate_limits["temp"] = github_folder_elements
    return github_folder_elements


# ---------------------------------------------------------------------------------------
# -- Model Loader


def download_hb_json(url: str) -> dict:
    """Download the HBJSON data from the URL and return the JSON content."""
    logger.info(f"Downloading from: {url}")
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
    logger.info(f"Loading HB-Model for: {team_name} | {project_name} | {model_name}")

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

    # -- Ensure the ModelView has it's Honeybee-Model object loaded.
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
