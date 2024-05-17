# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for GitHub API."""

from logging import getLogger

import requests
from fastapi import APIRouter, Header, HTTPException
from fastapi.security import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel

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
def get_github_files(token: str = Header(None)):
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
