# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for GitHub API."""

import requests
from fastapi import APIRouter, Header
from fastapi.security import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel

router = APIRouter()

# OAuth2 configuration
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://github.com/login/oauth/authorize",
    tokenUrl="https://github.com/login/oauth/access_token",
)


class GitHubPathElement(BaseModel):
    """A GitHub Path Element object that represents a file or folder within a GitHub repository."""

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


def get_github_api_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def walk_github_folders(headers: dict, parent: list[GitHubPathElement], url: str) -> list[GitHubPathElement]:
    """Recursively walk through the GitHub folders and files and return a list of all the GitHubPathElement objects."""
    response = requests.get(url, headers)
    response.raise_for_status()  # Raise exception if invalid response
    for responseData in response.json():
        new_path_object = GitHubPathElement(**responseData)
        if new_path_object.type == "dir":
            new_path_object.children = walk_github_folders(headers, new_path_object.children, new_path_object.url)
        parent.append(new_path_object)
    return parent


@router.get("/test", response_model=list[GitHubPathElement])
def get_github_files(token: str = Header(None)):
    headers = get_github_api_headers(token)
    github_folder_elements: list[GitHubPathElement] = []
    walk_github_folders(
        headers, github_folder_elements, "https://api.github.com/repos/bldgtyp/ph_navigator_data/contents/projects"
    )
    return github_folder_elements
