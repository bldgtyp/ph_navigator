# Fake DB for now...
from collections import defaultdict
from dataclasses import dataclass, field
import logging
import requests
from urllib.parse import urlparse

from honeybee.model import Model
from PHX.from_HBJSON import read_HBJSON_file

logger = logging.getLogger("uvicorn")


def get_github_raw_url(url: str):
    """Takes in a normal GitHub URL and converts it to a 'raw' URL. This is required
    to download the JSON file from GitHub. Note that any Private Repo would need to
    add the 'token' to the URL as a query parameter as well.

    > Input: https://github.com/bldgtyp/ph_navigator_data/blob/main/projects/2306/test_model.hbjson
    > Output: https://raw.githubusercontent.com/bldgtyp/ph_navigator_data/main/projects/2306/test_model.hbjson
    """
    # Parse the regular URL
    parsed_url = urlparse(url)
    if isinstance(parsed_url.path, bytes):
        # Non-ASCII characters in the URL path are encoded as bytes
        # Assume UTF-8 encoding
        path_string = parsed_url.path.decode("utf-8")
    else:
        path_string = str(parsed_url.path)

    # Extract the repository owner, repository name, and file path from the regular URL
    path_parts = path_string.split("/")
    repo_owner = path_parts[1]  # ie: "bldgtyp"
    repo_name = path_parts[2]  #  ie: "ph_navigator_data"
    remainder = path_parts[4:]  # ie: ['main', 'projects', '2306', 'test_model.hbjson']
    file_path = "/".join(remainder)

    # Construct the raw URL
    raw_url = f"https://raw.githubusercontent.com/{repo_owner}/{repo_name}/{file_path}"

    return raw_url


def download_hb_json(url: str) -> dict:
    """Download the HBJSON data from the URL and return the JSON content."""
    logger.info(f"Downloading RAW JSON file from: {url}")

    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for HTTP errors
    return response.json()


def get_hb_model_from_url(url: str) -> Model | None:
    """Get an HB-Model from a source URL."""
    if url is None:
        return None

    logger.info(f"Getting HB-Model from: {url}")
    model_dict = download_hb_json(url)
    return read_HBJSON_file.convert_hbjson_dict_to_hb_model(model_dict)


@dataclass
class PhNavigatorModelInstance:
    """A single PH-Navigator Model instance (variant) with a URI."""

    url: str | None = None
    hb_model: Model | None = None


@dataclass
class PhNavigatorProject:
    """A single PJ-Navigator Project with one or more PH-Navigator Model instances."""

    _models: dict[str, PhNavigatorModelInstance] = field(default_factory=dict)

    def add_ph_navigator_model(self, model_id: str, model_instance: PhNavigatorModelInstance):
        self._models[model_id] = model_instance

    def get_ph_navigator_model(self, model_id: str) -> PhNavigatorModelInstance:
        return self._models[model_id]

    def model_ids(self) -> list[str]:
        return list(self._models.keys())


class FakeDB:
    """Fake DB to store PH-Navigator Projects and Models."""

    def __init__(self):
        self._data: dict[str, PhNavigatorProject] = {}

    def add_ph_navigator_model(self, project_id: str, model_id: str, model_instance: PhNavigatorModelInstance):
        if project_id not in self._data:
            self._data[project_id] = PhNavigatorProject()
        self._data[project_id].add_ph_navigator_model(model_id, model_instance)

    def get_ph_navigator_model(self, project_id: str, model_id: str) -> PhNavigatorModelInstance:
        return self._data[project_id].get_ph_navigator_model(model_id)

    def get_project_and_model_ids(self) -> dict[str, list[str]]:
        """Return a dictionary of project IDs and their corresponding model IDs.

        Example:
        {
            "project_1": ["model_1", "model_2", ...],
            "project_2": ["model_3", "model_4", ...],
            ...
        }
        """
        model_ids: dict[str, list[str]] = defaultdict(list)
        for project_id, project in self._data.items():
            model_ids[project_id].extend(project.model_ids())
        return model_ids

    def add_from_hbjson_dict(self, project_id: str, model_id: str, hb_json: dict):
        """Add a new HBJSON model object to the FakeDB."""
        hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_json)
        model_instance = PhNavigatorModelInstance(url="", hb_model=hb_model)
        self.add_ph_navigator_model(project_id, model_id, model_instance)

    def add_from_github_url(self, project_id: str, model_id: str, url: str):
        """Add a new HBJSON model object to the FakeDB."""
        url = get_github_raw_url(url)
        hb_model = get_hb_model_from_url(url)
        model_instance = PhNavigatorModelInstance(url=url, hb_model=hb_model)
        self.add_ph_navigator_model(project_id, model_id, model_instance)
