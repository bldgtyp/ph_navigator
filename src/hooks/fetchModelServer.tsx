import constants from "../data/constants.json";

/**
 * Fetches data from the server using the specified endpoint and parameters.
 *
 * @param endpoint - The endpoint to fetch data from.
 * @param token - The token to include in the request headers.
 * @param params - The query parameters to include in the request URL.
 * @returns A promise that resolves to the fetched data.
 * @throws An error if the HTTP response is not successful.
 */
export async function fetchModelServer<T>(
    endpoint: string,
    token: string = "",
    params: Record<string, string | number> = {}
): Promise<T> {
    console.log("fetchModelServer", endpoint, token);
    const HEADERS = { 'token': token };
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;

    // Add query parameters to the URL
    const url = new URL(API_ENDPOINT);
    Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

    const response = await fetch(url.toString(), { headers: HEADERS })

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
