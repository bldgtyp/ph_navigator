import constants from "../../data/constants.json";
import { hbPhHvacHotWaterSystem } from "../../types/honeybee_phhvac/hot_water_system";


export async function fetchModelHotWaterPiping(endpoint: string): Promise<hbPhHvacHotWaterSystem[] | { error: string }> {
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Pull out the Face's json data
    const responseJson: { "message": string } = await response.json();
    return JSON.parse(responseJson['message']);
}

export default fetchModelHotWaterPiping;
