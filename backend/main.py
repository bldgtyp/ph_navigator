# -*- coding: utf-8 -*-
# -*- Python Version: 3.10 -*-

from collections import defaultdict
import json
import os
import pathlib

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pyairtable import Api
from pyairtable.api.types import RecordDict

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception as e:
    print(e)

from ladybug_geometry.geometry2d.pointvector import Point2D
from ladybug import epw
from ladybug.sunpath import Sunpath
from ladybug.compass import Compass
from honeybee import face, model
from honeybee.boundarycondition import Surface
from honeybee_energy.properties.face import FaceEnergyProperties
from honeybee_energy.construction.opaque import OpaqueConstruction
from honeybee_ph.properties.room import RoomPhProperties
from honeybee_phhvac.properties.room import RoomPhHvacProperties

from backend.db import FakeDB, PhNavigatorModelInstance

app = FastAPI()


origins = [
    "http://localhost:3000",
    "localhost:3000",
    "https://ph-tools.github.io",
    "https://bldgtyp.github.io",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -- Create the fake DB and add some sample project data
db = FakeDB()
team = db.add_new_team("bldgtyp")
project_2305 = team.add_new_project("2305")
project_2305.add_model_from_github_url(
    "409_SACKETT_240508",
    "https://github.com/bldgtyp/ph_navigator_data/blob/main/projects/2305/409_SACKETT_240508.hbjson",
)
project_2306 = team.add_new_project("2306")
project_2306.add_model_from_github_url(
    "test_model",
    "https://github.com/bldgtyp/ph_navigator_data/blob/main/projects/2306/test_model.hbjson",
)


# ----------------------------------------------------------------------------------------------------------------------


@app.get("/{team_id}/get_project_listing")
def get_project_listing(team_id: str):
    """Return a list of all the Projects with their IDs

    message : [
        {"name":"project_1", "identifier":UUID},
        {"name":"project_2", "identifier":UUID},
        ...
    ]
    """
    return {"message": json.dumps(db.get_projects_by_team_name(team_id))}


@app.post("/upload_hbjson_file")
async def upload_hbjson_file(
    _team_name: str, _project_name: str, _model_name: str, _file: UploadFile | None = File(...)
):
    # -------------------------------------------------------------------------
    if not _file:
        return {"error": "No file provided?"}

    # -------------------------------------------------------------------------
    filename = _file.filename or ""
    if not filename.endswith(".hbjson"):
        return {"error": "Sorry, only HBJSON files are allowed."}

    # -------------------------------------------------------------------------
    contents = await _file.read()  # Read the contents of the uploaded file as bytes
    json_data: dict = json.loads(contents)  # Decode the bytes to string and parse it as JSON

    # -------------------------------------------------------------------------
    try:
        team = db.add_new_team(_team_name)
        project = team.add_new_project(_project_name)
        project.add_model_from_hbjson_dict(_model_name, json_data)
    except Exception as e:
        return {"error": str(e)}

    return {"message": f"File: '{_file.filename}' uploaded successfully."}


# ----------------------------------------------------------------------------------------------------------------------
# -- THREE.js API ENDPOINTS


@app.get("/{team_id}/{project_id}/{model_id}/model_faces")
def model_faces(team_id: str, project_id: str, model_id: str) -> dict[str, str]:
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    # -- Add the Mesh3D to each to the Faces before sending them to the frontend
    face_dicts = []
    for face in ph_nav_model.hb_model.faces:
        face_dict = face.to_dict()
        face_dict["geometry"]["mesh"] = face.punched_geometry.triangulated_mesh3d.to_dict()
        face_dict["geometry"]["area"] = face.punched_geometry.area
        face_dict["properties"]["energy"]["construction"] = {}
        face_dict["properties"]["energy"]["construction"] = face.properties.energy.construction.to_dict()
        face_dict["properties"]["energy"]["construction"]["r_factor"] = face.properties.energy.construction.r_factor
        face_dict["properties"]["energy"]["construction"]["u_factor"] = face.properties.energy.construction.u_factor
        face_dict["apertures"] = []
        for aperture in face.apertures:
            aperture_dict = aperture.to_dict()
            aperture_dict["face_type"] = "Aperture"
            aperture_dict["properties"]["energy"]["construction"] = {}
            aperture_dict["properties"]["energy"]["construction"] = aperture.properties.energy.construction.to_dict()
            aperture_dict["properties"]["energy"]["construction"][
                "r_factor"
            ] = aperture.properties.energy.construction.r_factor
            aperture_dict["properties"]["energy"]["construction"][
                "u_factor"
            ] = aperture.properties.energy.construction.u_factor
            aperture_dict["geometry"]["mesh"] = aperture.geometry.triangulated_mesh3d.to_dict()
            aperture_dict["geometry"]["area"] = aperture.geometry.area
            face_dict["apertures"].append(aperture_dict)

        face_dicts.append(face_dict)
    return {"message": json.dumps(face_dicts)}


@app.get("/{team_id}/{project_id}/{model_id}/model_spaces")
def model_spaces(team_id: str, project_id: str, model_id: str) -> dict[str, str]:
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    # -- Get all the interior spaces in the model
    spaces = []
    for room in ph_nav_model.hb_model.rooms:
        room_ph_prop: RoomPhProperties = getattr(room.properties, "ph")
        for space in room_ph_prop.spaces:
            space_dict = space.to_dict(include_mesh=True)
            space_dict["net_volume"] = space.net_volume
            space_dict["floor_area"] = space.floor_area
            space_dict["weighted_floor_area"] = space.weighted_floor_area
            space_dict["avg_clear_height"] = space.avg_clear_height
            space_dict["average_floor_weighting_factor"] = space.average_floor_weighting_factor
            spaces.append(space_dict)
    return {"message": json.dumps(spaces)}


def _inside_face(_face: face.Face, _model_face_ids: set[str]) -> bool:
    # Make sure it is an 'outside' face.
    # If its a Surface exposure, it might be a party-wall, so check if its opposite face is in the model
    if isinstance(_face.boundary_condition, Surface):
        for srfc_identifier in _face.boundary_condition.boundary_condition_objects:
            if srfc_identifier in _model_face_ids:
                return True
    return False


@app.get("/{team_id}/{project_id}/{model_id}/model_exterior_constructions")
def model_exterior_constructions(team_id: str, project_id: str, model_id: str) -> dict[str, str]:
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    # -- Get all the Face-IDS in the model
    model_face_ids = set()
    for face in ph_nav_model.hb_model.faces:
        model_face_ids.add(face.identifier)

    # -- Get all the unique constructions in the model
    unique_constructions: dict[str, OpaqueConstruction] = {}
    for face in ph_nav_model.hb_model.faces:
        if _inside_face(face, model_face_ids):
            continue

        face_prop_energy: FaceEnergyProperties = getattr(face.properties, "energy")
        if isinstance(face_prop_energy.construction, OpaqueConstruction):
            unique_constructions[face_prop_energy.construction.display_name] = face_prop_energy.construction

    constructions = []
    for construction in unique_constructions.values():
        d = construction.to_dict()
        d["u_factor"] = construction.u_factor
        constructions.append(d)

    return {"message": json.dumps(constructions)}


@app.get("/{team_id}/{project_id}/{model_id}/sun_path")
def sun_path(team_id: str, project_id: str, model_id: str):
    SCALE = 0.4
    NORTH = 0
    DAYLIGHT_SAVINGS_PERIOD = None
    CENTER_POINT = Point2D(0, 0)
    RADIUS: int = 100 * SCALE  # type: ignore # 'int' is a lie to placate the un-typed Ladybug functions
    SOURCE_FILE = pathlib.Path("backend/climate/USA_NY_New.York-J.F.Kennedy.Intl.AP.744860_TMY3.epw").resolve()
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    epw_object = epw.EPW(SOURCE_FILE)
    sun_path = Sunpath.from_location(epw_object.location, NORTH, DAYLIGHT_SAVINGS_PERIOD)
    compass = Compass(RADIUS, CENTER_POINT, NORTH)
    geometry = {}
    geometry["hourly_analemma_polyline3d"] = [_.to_dict() for _ in sun_path.hourly_analemma_polyline3d(radius=RADIUS)]
    geometry["monthly_day_arc3d"] = [_.to_dict() for _ in sun_path.monthly_day_arc3d(radius=RADIUS)]
    geometry["compass"] = {}
    geometry["compass"]["all_boundary_circles"] = [_.to_dict() for _ in compass.all_boundary_circles]
    geometry["compass"]["major_azimuth_ticks"] = [_.to_dict() for _ in compass.major_azimuth_ticks]
    geometry["compass"]["minor_azimuth_ticks"] = [_.to_dict() for _ in compass.minor_azimuth_ticks]

    return {"message": json.dumps(geometry)}


@app.get("/{team_id}/{project_id}/{model_id}/hot_water_systems")
def hot_water_systems(team_id: str, project_id: str, model_id: str):
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    # -- Get each unique HW system in the model
    hw_systems = {}
    for room in ph_nav_model.hb_model.rooms:
        room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
        if not room_prop_phhvac.hot_water_system:
            continue
        hw_systems[room_prop_phhvac.hot_water_system.display_name] = room_prop_phhvac.hot_water_system

    hw_system_dicts = []
    for hw_system in hw_systems.values():
        hw_system_dicts.append(hw_system.to_dict(_include_properties=True))
    return {"message": json.dumps(hw_system_dicts)}


@app.get("/{team_id}/{project_id}/{model_id}/ventilation_systems")
def ventilation_systems(team_id: str, project_id: str, model_id: str):
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    # -- Get each unique HW system in the model
    ventilation_systems = {}
    for room in ph_nav_model.hb_model.rooms:
        room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
        if not room_prop_phhvac.ventilation_system:
            continue
        ventilation_systems[room_prop_phhvac.ventilation_system.display_name] = room_prop_phhvac.ventilation_system

    ventilation_system_dicts = []
    for ventilation_system in ventilation_systems.values():
        ventilation_system_dicts.append(ventilation_system.to_dict())
    return {"message": json.dumps(ventilation_system_dicts)}


@app.get("/{team_id}/{project_id}/{model_id}/shading_elements")
def shading_elements(team_id: str, project_id: str, model_id: str):
    # -- Get the right project model
    ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
    if not ph_nav_model or not ph_nav_model.hb_model:
        return {"message": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."}

    # -- Pull out all the model-level shades
    # -- Group them by display-name
    shades = defaultdict(list)
    for shade in ph_nav_model.hb_model.shades:
        d = shade.to_dict()
        d["geometry"]["mesh"] = shade.geometry.triangulated_mesh3d.to_dict()
        shades[shade.display_name].append(d)

    return {"message": json.dumps(shades)}


# ----------------------------------------------------------------------------------------------------------------------
# -- AirTable API ENDPOINTS


# @app.get("/{project_id}/cert_results/{result_type}")
# def get_certification_results(project_id: str) -> list[RecordDict]:
#     proj = input_data.get_input_item(project_id)
#     api = Api(os.environ["PH_VIEW_GET"])
#     table = api.table(proj.airtable_base_id, proj.airtable_ids["cert_results"])
#     data = table.all()
#     return data
