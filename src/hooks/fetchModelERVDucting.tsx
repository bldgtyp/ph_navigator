import constants from "../data/constants.json";
import { PhVentilationSystem } from "../types/PhVentilationSystem";


export async function fetchModelERVDucting(endpoint: string): Promise<PhVentilationSystem[]> {
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

export default fetchModelERVDucting;
