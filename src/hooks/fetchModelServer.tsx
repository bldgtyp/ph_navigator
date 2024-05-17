import constants from "../data/constants.json";

export async function fetchModelServer<T>(endpoint: string, token: string = ""): Promise<T> {
    console.log("fetchModelServer", endpoint, token);
    const HEADERS = { 'token': token };
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    const response = await fetch(API_ENDPOINT, { headers: HEADERS })

    if (!response.ok) {
        const txt: any = await response.json();
        throw new Error(`HTTP error! status: ${response.status} | ${txt.detail}`);
    }
    const responseJson = await response.json();
    try {
        return 'message' in responseJson ? JSON.parse(responseJson['message']) : responseJson;
    } catch (e) {
        return responseJson;
    }
}

export default fetchModelServer;
