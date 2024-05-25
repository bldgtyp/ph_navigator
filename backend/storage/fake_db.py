# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Pydantic fake Database."""

from logging import getLogger
from uuid import uuid4

from honeybee.model import Model as HBModel
from pydantic import BaseModel, Field, PrivateAttr

logger = getLogger("uvicorn")


def generate_identifier(_prefix: str = "") -> str:
    """Generate a unique identifier string with an optional prefix."""
    return f'{_prefix}{str(uuid4()).split("-")[0]}'


# ----------------------------------------------------------------------------------------------------------------------


class ModelView(BaseModel):
    """A 3D Model View with an associated source and a Honeybee Model."""

    identifier: str = Field(default_factory=lambda: generate_identifier("mv_"))
    display_name: str = ""
    hbjson_url: str | None = None
    _hb_model: HBModel | None = PrivateAttr(None)

    @property
    def name_and_id(self) -> str:
        """Return the ModelView's display name and identifier as a single string."""
        return f"{self.display_name} | {self.identifier}"


class Project(BaseModel):
    """A single Project can have multiple ModelViews."""

    identifier: str = Field(default_factory=lambda: generate_identifier("pr_"))
    display_name: str = ""
    model_storage: dict[str, ModelView] = {}

    @property
    def name_and_id(self) -> str:
        """Return the Project's display name and identifier as a single string."""
        return f"{self.display_name} | {self.identifier}"

    @property
    def model_views(self) -> list[ModelView]:
        """Return a list of all the ModelView's in the Project."""
        return list(self.model_storage.values())

    @property
    def model_view_ids(self) -> list[str]:
        """Return a list of all the ModelView's identifiers."""
        return list(self.model_storage.keys())

    @property
    def model_view_names(self) -> list[str]:
        """Return a list of all the ModelView's display names."""
        return [model_view.display_name for model_view in self.model_storage.values()]

    async def add_model_view(self, model_view: ModelView) -> ModelView:
        """Add a new empty ModelView to the Project."""
        logger.info(f"Adding model-view: '{model_view.name_and_id}' to project: '{self.name_and_id}'.")
        if existing_model_view := await self.get_model_view_by_name(model_view.display_name):
            logger.info(f"Model-view: '{model_view.name_and_id}' already exists in project: '{self.name_and_id}'.")
            return existing_model_view

        self.model_storage[model_view.identifier] = model_view
        return model_view

    async def get_model_view_by_name(self, model_view_name: str) -> ModelView | None:
        """Return a specific ModelView by its display name."""
        logger.info(f"Getting model-view: '{model_view_name}' from project: '{self.name_and_id}'.")
        for model_view in self.model_views:
            if model_view.display_name == model_view_name:
                return model_view

        logger.info(f"Model-view: '{model_view_name}' not found in project: '{self.name_and_id}'.")
        return None

    def __getitem__(self, key: str) -> ModelView:
        return self.model_storage[key]

    def __contains__(self, key: str) -> bool:
        return key in self.model_storage


class Team(BaseModel):
    """A Team can have multiple Projects."""

    identifier: str = Field(default_factory=lambda: generate_identifier("tm_"))
    display_name: str = ""
    project_storage: dict[str, Project] = {}

    @property
    def name_and_id(self) -> str:
        return f"{self.display_name} | {self.identifier}"

    @property
    def projects(self) -> list[Project]:
        return list(self.project_storage.values())

    @property
    def project_ids(self) -> list[str]:
        return list(self.project_storage.keys())

    @property
    def project_names(self) -> list[str]:
        return [project.display_name for project in self.project_storage.values()]

    async def add_project(self, project: Project) -> Project:
        """Add a new empty Project to the Team."""
        logger.info(f"Adding project: '{project.name_and_id}' to team: '{self.name_and_id}'.")
        if existing_project := await self.get_project_by_name(project.display_name):
            logger.info(f"Project: '{project.name_and_id}' already exists in team: '{self.name_and_id}'.")
            return existing_project

        self.project_storage[project.identifier] = project
        return project

    async def get_project_by_name(self, project_name: str) -> Project | None:
        """Return a specific Project by its display name."""
        logger.info(f"Getting project: '{project_name}' from team: '{self.name_and_id}'.")
        for project in self.projects:
            if project.display_name == project_name:
                return project

        logger.info(f"Project: '{project_name}' not found in team: '{self.name_and_id}'.")
        return None

    def __getitem__(self, key: str) -> Project:
        return self.project_storage[key]

    def __contains__(self, key: str) -> bool:
        return key in self.project_storage


class FakeDB(BaseModel):
    """A fake database to store Teams, Projects, and ModelViews."""

    identifier: str = Field(default_factory=lambda: generate_identifier("db_"))
    display_name: str = "fake_database"
    team_storage: dict[str, Team] = {}

    @property
    def teams(self) -> list[Team]:
        return list(self.team_storage.values())

    @property
    def team_ids(self) -> list[str]:
        return list(self.team_storage.keys())

    @property
    def team_names(self) -> list[str]:
        return [team.display_name for team in self.team_storage.values()]

    def add_team(self, team: Team):
        """Add a new empty Team to the database."""
        logger.info(f"Adding team '{team.display_name} | {team.identifier}' to the database.")
        self.team_storage[team.identifier] = team
        return team

    def get_team_by_id(self, team_id: str) -> Team:
        return self.team_storage[team_id]

    async def get_team_by_name(self, team_name: str) -> Team | None:
        """Return a specific Team by its display name."""
        logger.info(f"Getting team: '{team_name}' from database: '{self.display_name}'.")
        for team in self.team_storage.values():
            if team.display_name == team_name:
                return team

        logger.info(f"Team: '{team_name}' not found in database: '{self.display_name}'.")
        return None

    def preview(self):
        s = ["- " * 25]
        f"({self.__class__.__name__}) | {self.identifier} [{len(self.teams)} teams]"
        for team in self.teams:
            s.append(f"  - Team ({id(team)}): {team.display_name} |  {team.identifier} ({len(team.projects)} projects)")
            for project in team.projects:
                s.append(
                    f"    - Project ({id(project)}): {project.display_name} | {project.identifier} ({len(project.model_views)} models)"
                )
                for model_view in project.model_views:
                    s.append(
                        f"      - ModelView ({id(model_view)}): {model_view.display_name} | {model_view.identifier}"
                    )
        return "\n".join(s)

    def __getitem__(self, key: str) -> Team:
        return self.team_storage[key]

    def __contains__(self, key: str) -> bool:
        return key in self.team_storage


# ----------------------------------------------------------------------------------------------------------------------
logger.info("- " * 25)
logger.info("Creating a new fake database.")
_db_new_ = FakeDB()
_db_new_.add_team(Team(display_name="public"))
_db_new_.add_team(Team(display_name="bldgtyp"))
logger.info(_db_new_.preview())
logger.info("Done creating a new fake database.")
logger.info("- " * 25)
