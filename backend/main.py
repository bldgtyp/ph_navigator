# -*- coding: utf-8 -*-
# -*- Python Version: 3.10 -*-

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import pathlib
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

from PHX.from_HBJSON import read_HBJSON_file

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


# ----------------------------------------------------------------------------------------------------------------------
# -- TEMPORARY INPUT DATA FOR TESTING


class InputDataItem:
    def __init__(self, project_number: str, hb_model: model.Model, airtable_ids: dict[str, str]):
        self.project_number = project_number
        self.hb_model = hb_model
        self.airtable_ids = airtable_ids

    @property
    def airtable_base_id(self) -> str:
        return self.airtable_ids["app"]


class InputDataDispatcher:

    def __init__(self):
        self.input_data: dict[str, InputDataItem] = {}

    def add_input_item(self, _input_item: InputDataItem):
        self.input_data[_input_item.project_number] = _input_item

    def get_input_item(self, project_number: str) -> InputDataItem:
        return self.input_data[project_number]


SOURCE_FILE_2305 = pathlib.Path("backend/409_SACKETT_240503.hbjson").resolve()
SOURCE_FILE_2306 = pathlib.Path("backend/test_model.hbjson").resolve()


hb_json_dict_2305 = read_HBJSON_file.read_hb_json_from_file(SOURCE_FILE_2305)
hb_json_dict_2306 = read_HBJSON_file.read_hb_json_from_file(SOURCE_FILE_2306)


proj_2305 = InputDataItem(
    "proj_2305",
    read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_json_dict_2305),
    {
        "app": "app64a1JuYVBs7Z1m",
        "summary": "tblapLjAFgm7RIllz",
        "config": "tblRMar5uK7mDZ8yM",
        "cert_results": "tbluEAhlFEuhfuE5v",
        "materials": "tblkWxg3xXMjzjO32",
        "window_unit_types": "tblGOpIen7MnCuQRe",
        "frame_types": "tblejOjMq62zdRT3D",
        "glazing_types": "tbl3JAeRMqiloWQ65",
        "appliances": "tblqfzzcqc3o2IcD4",
        "lighting": "tblkLN5vn6fcXnTRT",
        "fans": "tbldbadmmNca7E1Nr",
        "pumps": "tbliRO0hZim8oQ2qw",
        "erv_units": "tblkIaP1TspndVI5f",
        "hot_water_tanks": "tbl3EYwyh6HhmlbqP",
    },
)
proj_2306 = InputDataItem(
    "proj_2306",
    read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_json_dict_2306),
    {
        "app": "app64a1JuYVBs7Z1m",
        "summary": "tblapLjAFgm7RIllz",
        "config": "tblRMar5uK7mDZ8yM",
        "cert_results": "tbluEAhlFEuhfuE5v",
        "materials": "tblkWxg3xXMjzjO32",
        "window_unit_types": "tblGOpIen7MnCuQRe",
        "frame_types": "tblejOjMq62zdRT3D",
        "glazing_types": "tbl3JAeRMqiloWQ65",
        "appliances": "tblqfzzcqc3o2IcD4",
        "lighting": "tblkLN5vn6fcXnTRT",
        "fans": "tbldbadmmNca7E1Nr",
        "pumps": "tbliRO0hZim8oQ2qw",
        "erv_units": "tblkIaP1TspndVI5f",
        "hot_water_tanks": "tbl3EYwyh6HhmlbqP",
    },
)


input_data = InputDataDispatcher()
input_data.add_input_item(proj_2305)
input_data.add_input_item(proj_2306)


# ----------------------------------------------------------------------------------------------------------------------
# -- THREE.js API ENDPOINTS


@app.get("/{project_id}/model_faces")
def model_faces(project_id: str) -> dict[str, str]:
    # -- Get the right project model
    proj = input_data.get_input_item(project_id)

    # -- Add the Mesh3D to each to the Faces before sending them to the frontend
    face_dicts = []
    for face in proj.hb_model.faces:
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


@app.get("/{project_id}/model_spaces")
def model_spaces(project_id: str) -> dict[str, str]:
    # -- Get the right project model
    proj = input_data.get_input_item(project_id)

    # -- Get all the interior spaces in the model
    spaces = []
    for room in proj.hb_model.rooms:
        room_ph_prop: RoomPhProperties = getattr(room.properties, "ph")
        for space in room_ph_prop.spaces:
            spaces.append(space.to_dict(include_mesh=True))
    return {"message": json.dumps(spaces)}


def _inside_face(_face: face.Face, _model_face_ids: set[str]) -> bool:
    # Make sure it is an 'outside' face.
    # If its a Surface exposure, it might be a party-wall, so check if its opposite face is in the model
    if isinstance(_face.boundary_condition, Surface):
        for srfc_identifier in _face.boundary_condition.boundary_condition_objects:
            if srfc_identifier in _model_face_ids:
                return True
    return False


@app.get("/{project_id}/model_exterior_constructions")
def model_exterior_constructions(project_id: str) -> dict[str, str]:
    # -- Get the right project model
    proj = input_data.get_input_item(project_id)

    # -- Get all the Face-IDS in the model
    model_face_ids = set()
    for face in proj.hb_model.faces:
        model_face_ids.add(face.identifier)

    # -- Get all the unique constructions in the model
    unique_constructions: dict[str, OpaqueConstruction] = {}
    for face in proj.hb_model.faces:
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


@app.get("/{project_id}/sun_path")
def sun_path(project_id: str):
    SCALE = 0.4
    NORTH = 0
    DAYLIGHT_SAVINGS_PERIOD = None
    CENTER_POINT = Point2D(0, 0)
    RADIUS = 100 * SCALE
    SOURCE_FILE = pathlib.Path("backend/climate/USA_NY_New.York-J.F.Kennedy.Intl.AP.744860_TMY3.epw").resolve()
    # -- Get the right project model
    proj = input_data.get_input_item(project_id)

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


@app.get("/{project_id}/hot_water_systems")
def hot_water_systems(project_id: str):
    # -- Get the right project model
    proj = input_data.get_input_item(project_id)

    # -- Get each unique HW system in the model
    hw_systems = {}
    for room in proj.hb_model.rooms:
        room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
        if not room_prop_phhvac.hot_water_system:
            continue
        hw_systems[room_prop_phhvac.hot_water_system.display_name] = room_prop_phhvac.hot_water_system

    hw_system_dicts = []
    for hw_system in hw_systems.values():
        hw_system_dicts.append(hw_system.to_dict())
    return {"message": json.dumps(hw_system_dicts)}


@app.get("/{project_id}/ventilation_systems")
def ventilation_systems(project_id: str):
    # -- Get the right project model
    proj = input_data.get_input_item(project_id)

    # -- Get each unique HW system in the model
    ventilation_systems = {}
    for room in proj.hb_model.rooms:
        room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
        if not room_prop_phhvac.ventilation_system:
            continue
        ventilation_systems[room_prop_phhvac.ventilation_system.display_name] = room_prop_phhvac.ventilation_system

    ventilation_system_dicts = []
    for ventilation_system in ventilation_systems.values():
        ventilation_system_dicts.append(ventilation_system.to_dict())
    return {"message": json.dumps(ventilation_system_dicts)}


# ----------------------------------------------------------------------------------------------------------------------
# -- AirTable API ENDPOINTS


@app.get("/{project_id}/cert_results/{result_type}")
def get_certification_results(project_id: str) -> list[RecordDict]:
    proj = input_data.get_input_item(project_id)
    api = Api(os.environ["PH_VIEW_GET"])
    table = api.table(proj.airtable_base_id, proj.airtable_ids["cert_results"])
    data = table.all()
    return data
