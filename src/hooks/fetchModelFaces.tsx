import constants from "../data/constants.json";
import { hbFace } from "../types/honeybee/face";



export async function fetchModelFaces(endpoint: string): Promise<hbFace[] | { error: string }> {
    // https://ph-navigator.onrender.com/#/2305/model_faces
    // http://localhost:8000/#/2305/model_faces
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
