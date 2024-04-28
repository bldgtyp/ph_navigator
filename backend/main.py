# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import pathlib

from PHX.from_HBJSON import create_project, read_HBJSON_file

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


@app.get("/server_ready")
def awake() -> dict[str, str]:
    """Check if the server is ready to go."""
    return {"message": "Server is ready"}


@app.get("/model_faces")
def model_faces() -> dict[str, str]:
    SOURCE_FILE = pathlib.Path(
        "/Users/em/Dropbox/bldgtyp-00/00_PH_Tools/ph_navigator/backend/test_model.hbjson"
    ).resolve()
    hb_json_dict = read_HBJSON_file.read_hb_json_from_file(SOURCE_FILE)
    hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_json_dict)

    # -- Add the Mesh3D to each to the Faces before sending them to the frontend
    face_dicts = []
    for face in hb_model.faces:
        face_dict = face.to_dict()
        face_dict["geometry"]["mesh"] = face.geometry.triangulated_mesh3d.to_dict()
        face_dict["geometry"]["area"] = face.geometry.area
        face_dicts.append(face_dict)
    return {"message": json.dumps(face_dicts)}
