# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

"""Routes for the THREE.js 3D Model Viewer."""

from collections import defaultdict
import pathlib
from logging import getLogger
from typing import Any

from fastapi import APIRouter, HTTPException
from honeybee import face, room, shade
from honeybee.boundarycondition import Surface
from honeybee_energy.construction.opaque import OpaqueConstruction
from honeybee_energy.properties.face import FaceEnergyProperties
from honeybee_ph.properties.room import RoomPhProperties
from honeybee_phhvac.properties.room import RoomPhHvacProperties
from honeybee_phhvac.hot_water_system import PhHotWaterSystem
from honeybee_phhvac.ventilation import PhVentilationSystem
from ladybug import epw
from ladybug.compass import Compass
from ladybug.sunpath import Sunpath
from ladybug_geometry.geometry2d.pointvector import Point2D

from backend.schemas.honeybee.face import FaceSchema
from backend.schemas.honeybee.shade import ShadeSchema, ShadeGroupSchema
from backend.schemas.honeybee_energy.construction.opaque import OpaqueConstructionSchema
from backend.schemas.honeybee_energy.construction.window import WindowConstructionSchema
from backend.schemas.honeybee_ph.space import SpaceSchema
from backend.schemas.honeybee_phhvac.hot_water_system import PhHotWaterSystemSchema
from backend.schemas.honeybee_phhvac.ventilation import PhVentilationSystemSchema
from backend.schemas.ladybug.compass import CompassSchema
from backend.schemas.ladybug.sunpath import SunPathAndCompassDTOSchema, SunPathSchema
from backend.schemas.ladybug_geometry.geometry2d.arc import Arc2D
from backend.schemas.ladybug_geometry.geometry2d.line import LineSegment2D
from backend.schemas.ladybug_geometry.geometry3d.arc import Arc3D
from backend.schemas.ladybug_geometry.geometry3d.face3d import Mesh3DSchema
from backend.schemas.ladybug_geometry.geometry3d.polyline import Polyline3D
from backend.storage.fake_db import ModelView, _db_new_

router = APIRouter()

logger = getLogger("uvicorn")

# ----------------------------------------------------------------------------------------------------------------------


def any_dict(d: dict[Any, Any]) -> dict[Any, Any]:
    """Wrap un-typed LBT dictionaries (like 'to_dict()') to avoid type-checking errors."""
    return d


async def get_model(team_name: str, project_name: str, model_name: str) -> ModelView:
    """Return a specific Model from a Project"""
    logger.info(f"  > three_js.get_model({team_name}, {project_name}, {model_name})")

    team = await _db_new_.get_team_by_name(team_name)
    if not team:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no team found with the name: '{team_name}'")

    project = await team.get_project_by_name(project_name)
    if not project:
        raise HTTPException(
            status_code=404, detail=f"Sorry, there was no project found with the name: '{project_name}'"
        )

    model = await project.get_model_view_by_name(model_name)
    if not model:
        raise HTTPException(status_code=404, detail=f"Sorry, there was no model found with the name: '{model_name}'")

    logger.info(f"  > Returning: {team_name} | {project_name} | {model.display_name}")
    return model


# ----------------------------------------------------------------------------------------------------------------------


@router.get("/{team_id}/{project_id}/{model_id}/faces", response_model=list[FaceSchema])
async def get_faces(team_id: str, project_id: str, model_id: str) -> list[FaceSchema]:
    """Return a list of all the Faces in a Honeybee Model."""
    logger.info(f"Route > get_faces({team_id}, {project_id}, {model_id})")

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    hb_faces: list[face.Face] = model_view._hb_model.faces

    # -- Note: Add the Mesh3D to each to the Faces before returning
    face_dicts: list[FaceSchema] = []
    for hb_face in hb_faces:
        face_DTO = FaceSchema(**any_dict(hb_face.to_dict()))

        # -- Get the extra Geometry attributes
        face_DTO.geometry.mesh = Mesh3DSchema(**hb_face.punched_geometry.triangulated_mesh3d.to_dict())
        face_DTO.geometry.area = hb_face.punched_geometry.area

        # -- Get the HB-Energy Construction and extra attributes
        hb_face_energy_prop: FaceEnergyProperties = getattr(hb_face.properties, "energy")
        construction = OpaqueConstructionSchema(**any_dict(hb_face_energy_prop.construction.to_dict()))
        face_DTO.properties.energy.construction = construction

        face_DTO.properties.energy.construction.r_factor = getattr(hb_face_energy_prop.construction, "r_factor", 0.0)
        face_DTO.properties.energy.construction.u_factor = getattr(hb_face_energy_prop.construction, "u_factor", 0.0)

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

    logger.info(f"  > Returning {len(face_dicts)} Model Faces.")

    return face_dicts


@router.get("/{team_id}/{project_id}/{model_id}/spaces", response_model=list[SpaceSchema])
async def get_spaces(team_id: str, project_id: str, model_id: str) -> list[SpaceSchema]:
    """Return a list of all the Spaces in a Honeybee Model."""
    logger.info(f"Route > get_spaces({team_id}, {project_id}, {model_id})")

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    # -- Get all the interior spaces in the model
    hb_rooms: tuple[room.Room] = model_view._hb_model.rooms
    spaces: list[SpaceSchema] = []
    for hb_room in hb_rooms:
        room_prop_ph: RoomPhProperties = getattr(hb_room.properties, "ph")
        for space in room_prop_ph.spaces:
            space_DTO = SpaceSchema(**space.to_dict(include_mesh=True))
            space_DTO.net_volume = space.net_volume
            space_DTO.floor_area = space.floor_area
            space_DTO.weighted_floor_area = space.weighted_floor_area
            space_DTO.avg_clear_height = space.avg_clear_height
            space_DTO.average_floor_weighting_factor = space.average_floor_weighting_factor
            spaces.append(space_DTO)

    logger.info(f"  > Returning {len(spaces)} Model Spaces.")
    return spaces


def is_inside_face(_face: face.Face, _model_face_ids: set[str]) -> bool:
    """Check if a face is an 'inside' face.

    If its a 'Surface' exposure type, it might be a party-wall as well, so also check if its opposite face is in the model.
    """

    if isinstance(_face.boundary_condition, Surface):
        for srfc_identifier in _face.boundary_condition.boundary_condition_objects:
            if srfc_identifier in _model_face_ids:
                return True
    return False


@router.get("/{team_id}/{project_id}/{model_id}/exterior_constructions", response_model=list[OpaqueConstructionSchema])
async def get_exterior_constructions(team_id: str, project_id: str, model_id: str) -> list[OpaqueConstructionSchema]:
    """Return a list of all the Exterior Constructions in a Honeybee Model."""
    logger.info(f"Route > get_exterior_constructions({team_id}, {project_id}, {model_id})")

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    # -- Get all the Face-IDS in the model
    model_face_ids = set()
    for face in model_view._hb_model.faces:
        model_face_ids.add(face.identifier)

    # -- Get all the unique constructions in the model
    unique_constructions: dict[str, OpaqueConstruction] = {}
    for face in model_view._hb_model.faces:
        if is_inside_face(face, model_face_ids):
            continue

        face_prop_energy: FaceEnergyProperties = getattr(face.properties, "energy")
        if isinstance(face_prop_energy.construction, OpaqueConstruction):
            unique_constructions[face_prop_energy.construction.display_name] = face_prop_energy.construction

    constructions: list[OpaqueConstructionSchema] = []
    for construction in unique_constructions.values():
        d = OpaqueConstructionSchema(**any_dict(construction.to_dict()))
        d.u_factor = construction.u_factor
        constructions.append(d)

    logger.info(f"  > Returning {len(constructions)} Exterior Constructions.")
    return constructions


@router.get("/{team_id}/{project_id}/{model_id}/sun_path", response_model=SunPathAndCompassDTOSchema)
async def get_sun_path(team_id: str, project_id: str, model_id: str) -> SunPathAndCompassDTOSchema:
    """Return the SunPath and Compass for a Honeybee-Model"""
    logger.info(f"Route > get_sun_path({team_id}, {project_id}, {model_id})")

    SCALE = 0.4
    NORTH = 0
    DAYLIGHT_SAVINGS_PERIOD = None
    CENTER_POINT = Point2D(0, 0)
    RADIUS: int = 100 * SCALE  # type: ignore # 'int' is a lie to placate the un-typed Ladybug functions...
    SOURCE_FILE = pathlib.Path("backend/climate/USA_NY_New.York-J.F.Kennedy.Intl.AP.744860_TMY3.epw").resolve()

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    try:
        epw_object = epw.EPW(SOURCE_FILE)
        if not epw_object:
            raise HTTPException(status_code=500, detail=f"Failed to load the EPW file: {SOURCE_FILE}")
    except Exception as e:
        logger.error(f"Failed to load the EPW file: {SOURCE_FILE}")
        raise HTTPException(status_code=500, detail=f"Failed to load the EPW file: {SOURCE_FILE}")

    # -- Build the Ladybug SunPath and Compass
    logger.info(f"Building LBT SunPath and LBT Compass from {SOURCE_FILE}")
    sun_path = Sunpath.from_location(epw_object.location, NORTH, DAYLIGHT_SAVINGS_PERIOD)
    compass = Compass(RADIUS, CENTER_POINT, NORTH)

    # -- Setup the the SunPath DTO
    logger.info(f"  > Converting SunPath to DTO...")
    sunpath_DTO = SunPathSchema()
    sunpath_DTO.hourly_analemma_polyline3d = [
        Polyline3D(**_.to_dict()) for _ in sun_path.hourly_analemma_polyline3d(radius=RADIUS)
    ]
    sunpath_DTO.monthly_day_arc3d = [Arc3D(**_.to_dict()) for _ in sun_path.monthly_day_arc3d(radius=RADIUS)]

    # -- Setup the the Compass DTO
    logger.info("  > Converting Compass to DTO...")
    compass_DTO = CompassSchema()
    compass_DTO.all_boundary_circles = [Arc2D(**_.to_dict()) for _ in compass.all_boundary_circles]
    compass_DTO.major_azimuth_ticks = [LineSegment2D(**_.to_dict()) for _ in compass.major_azimuth_ticks]
    compass_DTO.minor_azimuth_ticks = [LineSegment2D(**_.to_dict()) for _ in compass.minor_azimuth_ticks]

    logger.info("  > Returning SunPath and Compass DTOs.")
    return SunPathAndCompassDTOSchema(sunpath=sunpath_DTO, compass=compass_DTO)


@router.get("/{team_id}/{project_id}/{model_id}/hot_water_systems", response_model=list[PhHotWaterSystemSchema])
async def get_hot_water_systems(team_id: str, project_id: str, model_id: str) -> list[PhHotWaterSystemSchema]:
    """Return a list of all the Hot Water Systems in a Honeybee Model."""
    logger.info(f"Route > get_hot_water_systems({team_id}, {project_id}, {model_id})")

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    # -- Get each unique Honeybee-PH-HVAC Hot-Water system in the HB-Model
    hb_phHvac_hw_systems: dict[str, PhHotWaterSystem] = {}
    for room in model_view._hb_model.rooms:
        room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
        if not room_prop_phhvac.hot_water_system:
            continue
        hb_phHvac_hw_systems[room_prop_phhvac.hot_water_system.display_name] = room_prop_phhvac.hot_water_system

    # -- Convert the Honeybee-PH-HVAC Hot-Water systems to DTOs
    hw_system_DTOs: list[PhHotWaterSystemSchema] = []
    for hw_system in hb_phHvac_hw_systems.values():
        hw_system_DTOs.append(PhHotWaterSystemSchema(**hw_system.to_dict(_include_properties=True)))

    logger.info(f"  > Returning {len(hw_system_DTOs)} Hot Water Systems.")
    return hw_system_DTOs


@router.get("/{team_id}/{project_id}/{model_id}/ventilation_systems", response_model=list[PhVentilationSystemSchema])
async def get_ventilation_systems(team_id: str, project_id: str, model_id: str) -> list[PhVentilationSystemSchema]:
    """Return a list of all the Hot Water Systems in a Honeybee Model."""
    logger.info(f"Route > get_ventilation_systems({team_id}, {project_id}, {model_id})")

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    # -- Get each unique Ventilation system in the model
    ventilation_systems: dict[str, PhVentilationSystem] = {}
    for room in model_view._hb_model.rooms:
        room_prop_phhvac: RoomPhHvacProperties = getattr(room.properties, "ph_hvac")
        if not room_prop_phhvac.ventilation_system:
            continue
        ventilation_systems[room_prop_phhvac.ventilation_system.display_name] = room_prop_phhvac.ventilation_system

    # -- Convert the Ventilation systems to DTOs
    ventilation_system_DTOs: list[PhVentilationSystemSchema] = []
    for ventilation_system in ventilation_systems.values():
        ventilation_system_DTOs.append(PhVentilationSystemSchema(**ventilation_system.to_dict()))

    logger.info(f"  > Returning {len(ventilation_system_DTOs)} Ventilation Systems.")
    return ventilation_system_DTOs


@router.get("/{team_id}/{project_id}/{model_id}/shading_elements", response_model=list[ShadeGroupSchema])
async def get_shading_elements(team_id: str, project_id: str, model_id: str) -> list[ShadeGroupSchema]:
    """Return a list of all the Shading elements in a Honeybee Model."""
    logger.info(f"Route > get_shading_elements({team_id}, {project_id}, {model_id})")

    model_view = await get_model(team_id, project_id, model_id)
    if not model_view._hb_model:
        raise HTTPException(status_code=404, detail=f"No HB-Model found for: '{model_id}'")

    # -- Pull out all the model-level shades
    # -- Group them by their display-name
    logger.info("  > Building shade-surface geometry....")
    number_of_shades = 0
    shade_DTOs = defaultdict(ShadeGroupSchema)
    hb_shades: list[shade.Shade] = model_view._hb_model.shades
    for hb_shade in hb_shades:
        shade_DTO = ShadeSchema(**any_dict(hb_shade.to_dict()))
        shade_DTO.geometry.mesh = Mesh3DSchema(**hb_shade.geometry.triangulated_mesh3d.to_dict())
        shade_DTOs[hb_shade.display_name].shades.append(shade_DTO)
        number_of_shades += 1

    logger.info(f"  > Returning {number_of_shades} shade-surfaces in {len(shade_DTOs)} groups.")
    return list(shade_DTOs.values())
