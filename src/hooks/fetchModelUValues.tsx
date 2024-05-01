import constants from "../data/constants.json";
import { HoneybeeEnergyOpaqueConstruction } from "../types/HoneybeeEnergyOpaqueConstruction";



export async function fetchModelUValues(endpoint: string): Promise<HoneybeeEnergyOpaqueConstruction[]> {
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Pull out the Construction's json data
    const responseJson: { "message": string } = await response.json();
    const HoneybeeEnergyOpaqueConstructions: any[] = JSON.parse(responseJson['message']);
    return HoneybeeEnergyOpaqueConstructions;
}

export default fetchModelUValues;
