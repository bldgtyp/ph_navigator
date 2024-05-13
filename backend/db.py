# Fake DB for now...
from collections import defaultdict
from dataclasses import dataclass, field, asdict
import logging
import requests
from urllib.parse import urlparse
from uuid import uuid4, UUID

from honeybee.model import Model
from PHX.from_HBJSON import read_HBJSON_file

logger = logging.getLogger("uvicorn")


def generate_random_name(prefix: str | None = None) -> str:
    """Generate a random name for a new Team, Project, or Model."""
    base_name = str(uuid4()).split("-")[0]
    return f"{prefix}{base_name}"


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
    """A single PH-Navigator Model instance (variant)."""

    identifier: UUID = field(default_factory=uuid4)
    display_name: str = ""
    url: str | None = None
    hb_model: Model | None = None


@dataclass
class PhNavigatorProject:
    """A single PH-Navigator Project with one or more PH-Navigator Model instances."""

    identifier: UUID = field(default_factory=uuid4)
    display_name: str = ""
    models: dict[UUID, PhNavigatorModelInstance] = field(default_factory=dict)

    def __getitem__(self, key: UUID) -> PhNavigatorModelInstance:
        return self.models[key]

    def __setitem__(self, key: UUID, value: PhNavigatorModelInstance):
        self.models[key] = value

    def __contains__(self, key: UUID) -> bool:
        return key in self.models

    def add_ph_navigator_model(self, model_instance: PhNavigatorModelInstance):
        self.models[model_instance.identifier] = model_instance

    def get_ph_navigator_model_by_id(self, model_id: UUID) -> PhNavigatorModelInstance | None:
        return self.models.get(model_id, None)

    def get_ph_navigator_model_by_name(self, model_name: str) -> PhNavigatorModelInstance | None:
        for model in self.models.values():
            if model.display_name == model_name:
                return model
        return None

    @property
    def model_ids(self) -> list[UUID]:
        return list(self.models.keys())

    @property
    def model_names(self) -> list[str]:
        return [model.display_name for model in self.models.values()]

    def add_model_from_hbjson_dict(self, _model_name: str, hb_json: dict):
        """Add a new HBJSON model object to the Project."""
        hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_json)
        model_instance = PhNavigatorModelInstance(display_name=_model_name, url="", hb_model=hb_model)
        self.add_ph_navigator_model(model_instance)

    def add_model_from_github_url(self, _model_name: str, url: str):
        """Add a new HBJSON model to the Project from a URL address."""
        url = get_github_raw_url(url)
        hb_model = get_hb_model_from_url(url)
        model_instance = PhNavigatorModelInstance(display_name=_model_name, url=url, hb_model=hb_model)
        self.add_ph_navigator_model(model_instance)


@dataclass
class PhNavigatorTeam:
    """A single PH-Navigator Team with one or more PH-Navigator Projects."""

    identifier: UUID = field(default_factory=uuid4)
    display_name: str = ""
    projects: dict[UUID, PhNavigatorProject] = field(default_factory=dict)

    def __getitem__(self, key: UUID) -> PhNavigatorProject:
        return self.projects[key]

    def __setitem__(self, key: UUID, value: PhNavigatorProject):
        self.projects[key] = value

    def __contains__(self, key: UUID) -> bool:
        return key in self.projects

    def create_new_project(self, project_name: str) -> PhNavigatorProject:
        project = self.get_ph_navigator_project_by_name(project_name)
        if project:
            return project

        project_id = uuid4()
        self.projects[project_id] = PhNavigatorProject(display_name=project_name)
        return self.projects[project_id]

    def add_ph_navigator_project(self, project_instance: PhNavigatorProject):
        self.projects[project_instance.identifier] = project_instance

    def get_ph_navigator_project_by_id(self, project_id: UUID) -> PhNavigatorProject | None:
        return self.projects.get(project_id, None)

    def get_ph_navigator_project_by_name(self, project_name: str) -> PhNavigatorProject | None:
        for project in self.projects.values():
            if project.display_name == project_name:
                return project
        return None

    @property
    def project_ids(self) -> list[UUID]:
        return list(self.projects.keys())

    @property
    def project_names(self) -> list[str]:
        return [project.display_name for project in self.projects.values()]


class FakeDB:
    """Fake DB to store PH-Navigator Projects and Models."""

    def __init__(self):
        self._data: dict[UUID, PhNavigatorTeam] = {}
        self.add_new_team("public")  # Add a default "public" team

    def add_new_team(self, team_name: str) -> PhNavigatorTeam:
        team = self.get_team_by_name(team_name)
        if team:
            return team

        team_id = uuid4()
        self._data[team_id] = PhNavigatorTeam(display_name=team_name)
        return self._data[team_id]

    def get_team_by_id(self, team_id: UUID) -> PhNavigatorTeam | None:
        return self._data.get(team_id, None)

    def get_team_by_name(self, team_name: str) -> PhNavigatorTeam | None:
        for team in self._data.values():
            if team.display_name == team_name:
                return team
        return None

    def get_ph_navigator_model_by_id(
        self, team_id: UUID, project_id: UUID, model_id: UUID
    ) -> PhNavigatorModelInstance | None:
        team = self._data.get(team_id, None)
        if not team:
            return None

        project = team.get_ph_navigator_project_by_id(project_id)
        if not project:
            return None

        return project.get_ph_navigator_model_by_id(model_id)

    def get_ph_navigator_model_by_name(
        self, team_name: str, project_name: str, model_name: str
    ) -> PhNavigatorModelInstance | None:
        team = self.get_team_by_name(team_name)
        if not team:
            return None

        project = team.get_ph_navigator_project_by_name(project_name)
        if not project:
            return None

        return project.get_ph_navigator_model_by_name(model_name)

    def get_projects_by_team_name(self, team_name: str) -> list[dict]:
        team = self.get_team_by_name(team_name)
        if not team:
            return []

        project_data: list[dict] = []
        for project in team.projects.values():
            project_data.append(
                {
                    "display_name": project.display_name,
                    "identifier": str(project.identifier),
                }
            )

        return project_data

    def get_id_tree(self) -> dict:
        """Return a dictionary of Team, Project, and Model Ids in a dict.

        Example:
        {
            "team_1": {
                "project_1": {
                    "project_1": ["model_1", "model_2", ...],
                    "project_2": ["model_3", "model_4", ...],
                    ...
                },
                project_2: {...},
            },
            "team_2": {...},
            ...
        }
        """
        d = {}
        # for team_id, team in self._data.items():
        #     d[team_id] = asdict(team)
        return d

    @property
    def team_ids(self) -> list[UUID]:
        return list(self._data.keys())

    @property
    def team_names(self) -> list[str]:
        return [team.display_name for team in self._data.values()]
