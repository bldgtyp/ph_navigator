import { fetchModelServer } from "../hooks/fetchModelServer";
import { hbFace } from "../types/honeybee/face";
import { hbPhSpace } from "../types/honeybee_ph/space";
import { lbtSunPathDTO } from "../types/ladybug/sunpath";
import { hbPhHvacHotWaterSystem } from "../types/honeybee_phhvac/hot_water_system";
import { hbPhHvacVentilationSystem } from "../types/honeybee_phhvac/ventilation";
import { hbShadeGroup } from "../types/honeybee/shade";

/**
 * Fetches data from the model server with a modal for errors.
 *
 * @param endpoint - The endpoint to fetch data from.
 * @param token - The authentication token (optional).
 * @param params - Additional parameters for the request (optional).
 * @returns A Promise that resolves to the fetched data or null if there was an error.
 */
async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`
        alert(message);
        return null;
    } else {
        return data;
    }
}

/**
 * Fetches model data from the server.
 * @param teamId - The ID of the team.
 * @param projectId - The ID of the project.
 * @param modelId - The ID of the model.
 * @returns An object containing the fetched model data, including faces, spaces, sun path data,
 * hot water system data, ventilation system data, and shading elements data.
 * Returns null if there was an error during the fetch.
 */
export async function fetchModelDataFromServer(
    teamId: string, projectId: string, modelId: string) {
    try {
        console.log(`Loading data for ${teamId}/${projectId}/${modelId}`)
        const routeLoadModel = `${teamId}/${projectId}/${modelId}/load_hb_model`;
        const modelData = await fetchWithModal<hbFace[]>(routeLoadModel);
        if (!modelData) { return null }

        const routeFaces = `${teamId}/${projectId}/${modelId}/faces`;
        const facesData = await fetchWithModal<hbFace[]>(routeFaces);

        const routeSpaces = `${teamId}/${projectId}/${modelId}/spaces`;
        const spacesData = await fetchWithModal<hbPhSpace[]>(routeSpaces);

        const routeSunPath = `${teamId}/${projectId}/${modelId}/sun_path`;
        const sunPathData = await fetchWithModal<lbtSunPathDTO[]>(routeSunPath);

        const routeHotWaterSystem = `${teamId}/${projectId}/${modelId}/hot_water_systems`;
        const hotWaterSystemData = await fetchWithModal<hbPhHvacHotWaterSystem[]>(routeHotWaterSystem);

        const routeVentilationSystem = `${teamId}/${projectId}/${modelId}/ventilation_systems`;
        const ventilationSystemData = await fetchWithModal<hbPhHvacVentilationSystem[]>(routeVentilationSystem);

        const routeShades = `${teamId}/${projectId}/${modelId}/shading_elements`;
        const shadingElementsData = await fetchWithModal<hbShadeGroup[]>(routeShades);

        return { facesData, spacesData, sunPathData, hotWaterSystemData, ventilationSystemData, shadingElementsData };
    } catch (error) {
        console.error(error);
        return null;
    }
}
