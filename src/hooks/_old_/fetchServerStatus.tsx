import constants from "../../data/constants.json";

export async function fetchServerStatus<T>(endpoint: string): Promise<T> {
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();
    return responseJson;
}

export default fetchServerStatus;
