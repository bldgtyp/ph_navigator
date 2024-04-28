import constants from "../data/constants.json";
import { HoneybeeFace3D } from "../types/HoneybeeFace3D";



export async function fetchModelFaces(endpoint: string): Promise<HoneybeeFace3D[]> {
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Pull out the Face's json data
    const responseJson: { "message": string } = await response.json();
    const typeFaces: any[] = JSON.parse(responseJson['message']);
    return typeFaces;
}

export default fetchModelFaces;
