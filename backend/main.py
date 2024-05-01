# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import pathlib

from ladybug_geometry.geometry2d.pointvector import Point2D
from ladybug import epw
from ladybug.sunpath import Sunpath
from ladybug.compass import Compass
from honeybee_energy.properties.face import FaceEnergyProperties
from honeybee_energy.construction.opaque import OpaqueConstruction
from honeybee_ph.properties.room import RoomPhProperties

from PHX.from_HBJSON import read_HBJSON_file

app = FastAPI()

SOURCE_FILE = pathlib.Path("/Users/em/Dropbox/bldgtyp-00/00_PH_Tools/ph_navigator/backend/test_model.hbjson").resolve()

hb_json_dict = read_HBJSON_file.read_hb_json_from_file(SOURCE_FILE)
hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_json_dict)

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


@app.get("/server_ready")
def awake() -> dict[str, str]:
    """Check if the server is ready to go."""
    return {"message": "Server is ready"}


@app.get("/model_faces")
def model_faces() -> dict[str, str]:
    # -- Add the Mesh3D to each to the Faces before sending them to the frontend
    face_dicts = []
    for face in hb_model.faces:
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


@app.get("/model_spaces")
def model_spaces() -> dict[str, str]:
    # Get all the interior spaces in the model
    spaces = []
    for room in hb_model.rooms:
        room_ph_prop: RoomPhProperties = getattr(room.properties, "ph")
        for space in room_ph_prop.spaces:
            spaces.append(space.to_dict(include_mesh=True))
    return {"message": json.dumps(spaces)}


@app.get("/model_constructions")
def model_constructions() -> dict[str, str]:
    # Get all the unique constructions in the model
    unique_constructions: dict[str, OpaqueConstruction] = {}
    for face in hb_model.faces:
        face_prop_energy: FaceEnergyProperties = getattr(face.properties, "energy")
        if isinstance(face_prop_energy.construction, OpaqueConstruction):
            unique_constructions[face_prop_energy.construction.display_name] = face_prop_energy.construction

    constructions = []
    for construction in unique_constructions.values():
        d = construction.to_dict()
        d["u_factor"] = construction.u_factor
        constructions.append(d)

    return {"message": json.dumps(constructions)}


@app.get("/sun_path")
def sun_path():
    SCALE = 0.4
    NORTH = 0
    DAYLIGHT_SAVINGS_PERIOD = None
    CENTER_POINT = Point2D(0, 0)
    RADIUS = 100 * SCALE
    SOURCE_FILE = pathlib.Path(
        "/Users/em/Dropbox/bldgtyp-00/00_PH_Tools/ph_navigator/backend/climate/USA_NY_New.York-J.F.Kennedy.Intl.AP.744860_TMY3.epw"
    ).resolve()

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
