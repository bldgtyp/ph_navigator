# Fake DB for now...
from dataclasses import dataclass, field
import logging
import requests
from urllib.parse import urlparse

from honeybee.model import Model
from PHX.from_HBJSON import read_HBJSON_file

logger = logging.getLogger("uvicorn")


@dataclass
class PhNavigatorModelInstance:
    """A single PH-Navigator Model instance (variant) with a URI."""

    url: str
    _hb_model: Model | None = None

    @property
    def hb_model(self) -> Model:
        if self._hb_model is None:
            self._hb_model = self.get_hb_model_from_source()
        return self._hb_model

    @property
    def raw_url(self):
        """Takes in a normal GitHub URL and converts it to a 'raw' URL. This is required
        to download the JSON file from GitHub. Note that any Private Repo would need to
        add the 'token' to the URL as a query parameter as well.

        > Input: https://github.com/bldgtyp/ph_navigator_data/blob/main/projects/2306/test_model.hbjson
        > Output: https://raw.githubusercontent.com/bldgtyp/ph_navigator_data/main/projects/2306/test_model.hbjson
        """
        # Parse the regular URL
        parsed_url = urlparse(self.url)

        # Extract the repository owner, repository name, and file path from the regular URL
        path_parts = parsed_url.path.split("/")
        repo_owner = path_parts[1]  # ie: "bldgtyp"
        repo_name = path_parts[2]  #  ie: "ph_navigator_data"
        remainder = path_parts[4:]  # ie: ['main', 'projects', '2306', 'test_model.hbjson']
        file_path = "/".join(remainder)

        # Construct the raw URL
        raw_url = f"https://raw.githubusercontent.com/{repo_owner}/{repo_name}/{file_path}"

        return raw_url

    def download_hb_json(self) -> dict:
        """Download the HBJSON data from the URL and return the JSON content."""
        msg = f"Downloading RAW JSON file from: {self.raw_url}"
        logger.info(msg)

        response = requests.get(self.raw_url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()

    def get_hb_model_from_source(self) -> Model:
        msg = f"Getting HB-Model from: {self.url}"
        logger.info(msg)
        model_dict = self.download_hb_json()
        return read_HBJSON_file.convert_hbjson_dict_to_hb_model(model_dict)


@dataclass
class PhNavigatorProject:
    """A single PJ-Navigator Project with one or more PH-Navigator Model instances."""

    _models: dict[str, PhNavigatorModelInstance] = field(default_factory=dict)

    def add_ph_navigator_model(self, model_id: str, model_instance: PhNavigatorModelInstance):
        self._models[model_id] = model_instance

    def get_ph_navigator_model(self, model_id: str) -> PhNavigatorModelInstance:
        return self._models[model_id]


class FakeDB:
    """Fake DB to store PH-Navigator Projects and Models."""

    def __init__(self):
        self._data: dict[str, PhNavigatorProject] = {}

    def add_ph_navigator_project(self, project_id: str, project: PhNavigatorProject):
        self._data[project_id] = project

    def get_ph_navigator_project(self, project_id: str) -> PhNavigatorProject:
        return self._data[project_id]

    def add_ph_navigator_model(self, project_id: str, model_id: str, model_instance: PhNavigatorModelInstance):
        if project_id not in self._data:
            self._data[project_id] = PhNavigatorProject()
        self._data[project_id].add_ph_navigator_model(model_id, model_instance)

    def get_ph_navigator_model(self, project_id: str, model_id: str) -> PhNavigatorModelInstance:
        return self._data[project_id].get_ph_navigator_model(model_id)
