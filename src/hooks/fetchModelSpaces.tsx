import constants from "../data/constants.json";
import { hbPHSpace } from "../types/honeybee_ph/space";


export async function fetchModelSpaces(endpoint: string): Promise<hbPHSpace[]> {
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Pull out the Face's json data
    const responseJson: { "message": string } = await response.json();
    const typeSpaces: any[] = JSON.parse(responseJson['message']);
    return typeSpaces;
}

export default fetchModelSpaces;
