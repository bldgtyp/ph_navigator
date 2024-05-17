# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for the THREE.js 3D Model Viewer."""

import json
import pathlib
from collections import defaultdict
from logging import getLogger

from fastapi import APIRouter, HTTPException
from honeybee import face, model
from honeybee.boundarycondition import Surface
from honeybee_energy.construction.opaque import OpaqueConstruction
from honeybee_energy.properties.face import FaceEnergyProperties
from honeybee_ph.properties.room import RoomPhProperties
from honeybee_phhvac.properties.room import RoomPhHvacProperties
from ladybug import epw
from ladybug.compass import Compass
from ladybug.sunpath import Sunpath
from ladybug_geometry.geometry2d.pointvector import Point2D
from PHX.from_HBJSON import read_HBJSON_file

from backend.routes.github import download_hb_json
from backend.schemas.honeybee.face import FaceSchema
from backend.schemas.honeybee_energy.construction.opaque import OpaqueConstructionSchema
from backend.schemas.honeybee_energy.construction.window import WindowConstructionSchema
from backend.schemas.ladybug_geometry.geometry3d.face3d import Mesh3DSchema
from backend.storage.db_new import _db_new_

router = APIRouter()

logger = getLogger("uvicorn")


# ----------------------------------------------------------------------------------------------------------------------


@router.get("/{team_id}/{project_id}/{model_id}/model_faces", response_model=list[FaceSchema])
def model_faces(team_id: str, project_id: str, model_id: str):
    """Return a list of all the Faces in a Honeybee Model."""
    logger.info(f"Getting Faces for: {team_id} | {project_id} | {model_id}")

    team = _db_new_.get_team_by_name(team_id)
    if not team:
        raise HTTPException(status_code=404, detail=f"No Team found for: '{team_id}'")

    project = team.get_project_by_name(project_id)
    if not project:
        raise HTTPException(status_code=404, detail=f"No Project found for: '{project_id}'")

    model_view = project.get_model_view_by_name(model_id)
    if not model_view:
        raise HTTPException(status_code=404, detail=f"No Model found for: '{model_id}'")

    if model_view._hb_model is None:
        hb_model_dict = download_hb_json(model_view.hbjson_url)
        try:
            hb_model = read_HBJSON_file.convert_hbjson_dict_to_hb_model(hb_model_dict)
        except Exception as e:
            raise HTTPException(
                status_code=404, detail=f"Failed to create HB-Model from URL: '{model_view.hbjson_url}' | {e}"
            )
        model_view._hb_model = hb_model

    # -- Note: Add the Mesh3D to each to the Faces before returning
    face_dicts: list[FaceSchema] = []
    for hb_face in model_view._hb_model.faces:
        face_DTO = FaceSchema(**hb_face.to_dict())

        # -- Get the extra Geometry attributes
        face_DTO.geometry.mesh = Mesh3DSchema(**hb_face.punched_geometry.triangulated_mesh3d.to_dict())
        face_DTO.geometry.area = hb_face.punched_geometry.area

        # -- Get the HB-Energy Construction and extra attributes
        construction = OpaqueConstructionSchema(**hb_face.properties.energy.construction.to_dict())
        face_DTO.properties.energy.construction = construction
        face_DTO.properties.energy.construction.r_factor = hb_face.properties.energy.construction.r_factor
        face_DTO.properties.energy.construction.u_factor = hb_face.properties.energy.construction.u_factor

        # -- Get the Aperture data
        for aperture_DTO, hb_aperture in zip(face_DTO.apertures or [], hb_face.apertures or []):
            # -- Aperture Mesh Geometry
            aperture_DTO.geometry.mesh = Mesh3DSchema(**hb_aperture.geometry.triangulated_mesh3d.to_dict())
            aperture_DTO.geometry.area = hb_aperture.geometry.area

            # -- Aperture Construction
            ap_construction = WindowConstructionSchema(**hb_aperture.properties.energy.construction.to_dict())
            ap_construction.r_factor = hb_aperture.properties.energy.construction.r_factor
            ap_construction.u_factor = hb_aperture.properties.energy.construction.u_factor
            aperture_DTO.properties.energy.construction = ap_construction

        face_dicts.append(face_DTO)

    return face_dicts


# @router.get("/{team_id}/{project_id}/{model_id}/model_spaces")
# def model_spaces(team_id: str, project_id: str, model_id: str):
#     # -- Get the right project model
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     # -- Get all the interior spaces in the model
#     spaces = []
#     for room in ph_nav_model.hb_model.rooms:
#         room_ph_prop: RoomPhProperties = getattr(room.properties, "ph")
#         for space in room_ph_prop.spaces:
#             space_dict = space.to_dict(include_mesh=True)
#             space_dict["net_volume"] = space.net_volume
#             space_dict["floor_area"] = space.floor_area
#             space_dict["weighted_floor_area"] = space.weighted_floor_area
#             space_dict["avg_clear_height"] = space.avg_clear_height
#             space_dict["average_floor_weighting_factor"] = space.average_floor_weighting_factor
#             spaces.append(space_dict)
#     return {"message": json.dumps(spaces)}


# def _inside_face(_face: face.Face, _model_face_ids: set[str]) -> bool:
#     # Make sure it is an 'outside' face.
#     # If its a Surface exposure, it might be a party-wall, so check if its opposite face is in the model
#     if isinstance(_face.boundary_condition, Surface):
#         for srfc_identifier in _face.boundary_condition.boundary_condition_objects:
#             if srfc_identifier in _model_face_ids:
#                 return True
#     return False


# @router.get("/{team_id}/{project_id}/{model_id}/model_exterior_constructions")
# def model_exterior_constructions(team_id: str, project_id: str, model_id: str):
#     # -- Get the right project model
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     # -- Get all the Face-IDS in the model
#     model_face_ids = set()
#     for face in ph_nav_model.hb_model.faces:
#         model_face_ids.add(face.identifier)

#     # -- Get all the unique constructions in the model
#     unique_constructions: dict[str, OpaqueConstruction] = {}
#     for face in ph_nav_model.hb_model.faces:
#         if _inside_face(face, model_face_ids):
#             continue

#         face_prop_energy: FaceEnergyProperties = getattr(face.properties, "energy")
#         if isinstance(face_prop_energy.construction, OpaqueConstruction):
#             unique_constructions[face_prop_energy.construction.display_name] = face_prop_energy.construction

#     constructions = []
#     for construction in unique_constructions.values():
#         d = construction.to_dict()
#         d["u_factor"] = construction.u_factor
#         constructions.append(d)

#     return {"message": json.dumps(constructions)}


# @router.get("/{team_id}/{project_id}/{model_id}/sun_path")
# def sun_path(team_id: str, project_id: str, model_id: str):
#     SCALE = 0.4
#     NORTH = 0
#     DAYLIGHT_SAVINGS_PERIOD = None
#     CENTER_POINT = Point2D(0, 0)
#     RADIUS: int = 100 * SCALE  # type: ignore # 'int' is a lie to placate the un-typed Ladybug functions
#     SOURCE_FILE = pathlib.Path("backend/climate/USA_NY_New.York-J.F.Kennedy.Intl.AP.744860_TMY3.epw").resolve()
#     # -- Get the right project model
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     epw_object = epw.EPW(SOURCE_FILE)
#     sun_path = Sunpath.from_location(epw_object.location, NORTH, DAYLIGHT_SAVINGS_PERIOD)
#     compass = Compass(RADIUS, CENTER_POINT, NORTH)
#     geometry = {}
#     geometry["hourly_analemma_polyline3d"] = [_.to_dict() for _ in sun_path.hourly_analemma_polyline3d(radius=RADIUS)]
#     geometry["monthly_day_arc3d"] = [_.to_dict() for _ in sun_path.monthly_day_arc3d(radius=RADIUS)]
#     geometry["compass"] = {}
#     geometry["compass"]["all_boundary_circles"] = [_.to_dict() for _ in compass.all_boundary_circles]
#     geometry["compass"]["major_azimuth_ticks"] = [_.to_dict() for _ in compass.major_azimuth_ticks]
#     geometry["compass"]["minor_azimuth_ticks"] = [_.to_dict() for _ in compass.minor_azimuth_ticks]

#     return {"message": json.dumps(geometry)}


# @router.get("/{team_id}/{project_id}/{model_id}/hot_water_systems")
# def hot_water_systems(team_id: str, project_id: str, model_id: str):
#     # -- Get the right project model
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     # -- Get each unique HW system in the model
#     hw_systems = {}
#     for room in ph_nav_model.hb_model.rooms:
#         room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
#         if not room_prop_phhvac.hot_water_system:
#             continue
#         hw_systems[room_prop_phhvac.hot_water_system.display_name] = room_prop_phhvac.hot_water_system

#     hw_system_dicts = []
#     for hw_system in hw_systems.values():
#         hw_system_dicts.append(hw_system.to_dict(_include_properties=True))
#     return {"message": json.dumps(hw_system_dicts)}


# @router.get("/{team_id}/{project_id}/{model_id}/ventilation_systems")
# def ventilation_systems(team_id: str, project_id: str, model_id: str):
#     # -- Get the right project model
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     # -- Get each unique HW system in the model
#     ventilation_systems = {}
#     for room in ph_nav_model.hb_model.rooms:
#         room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
#         if not room_prop_phhvac.ventilation_system:
#             continue
#         ventilation_systems[room_prop_phhvac.ventilation_system.display_name] = room_prop_phhvac.ventilation_system

#     ventilation_system_dicts = []
#     for ventilation_system in ventilation_systems.values():
#         ventilation_system_dicts.append(ventilation_system.to_dict())
#     return {"message": json.dumps(ventilation_system_dicts)}


# @router.get("/{team_id}/{project_id}/{model_id}/shading_elements")
# def shading_elements(team_id: str, project_id: str, model_id: str):
#     # -- Get the right project model
#     ph_nav_model = db.get_ph_navigator_model_by_name(team_id, project_id, model_id)
#     if not ph_nav_model or not ph_nav_model.hb_model:
#         return {"message": json.dumps({"error": f"No HB-Model found for: {team_id} | {project_id} | {model_id}."})}

#     # -- Pull out all the model-level shades
#     # -- Group them by display-name
#     shades = defaultdict(list)
#     for shade in ph_nav_model.hb_model.shades:
#         d = shade.to_dict()
#         d["geometry"]["mesh"] = shade.geometry.triangulated_mesh3d.to_dict()
#         shades[shade.display_name].append(d)

#     return {"message": json.dumps(shades)}
