import constants from "../data/constants.json";


export async function fetchModelServer<T>(
    endpoint: string,
    token: string = "",
    params: Record<string, string | number> = {}
): Promise<{ data: T | null, error: any }> {
    console.log("fetchModelServer", endpoint, token);
    const HEADERS = { 'token': token };
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;

    // Add query parameters to the URL
    const url = new URL(API_ENDPOINT);
    Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

    // Delay for Testing...
    await new Promise(resolve => setTimeout(resolve, 500)); // 1/2 second delay

    const response = await fetch(url.toString(), { headers: HEADERS })

    if (!response.ok) {
        const txt: any = await response.json();
        console.log(`HTTP error [${response.status}] ${txt.detail} | ${API_ENDPOINT}`);
        return { data: null, error: `HTTP error [${response.status}] ${txt.detail} | ${API_ENDPOINT}` };
    }

    const data: T = await response.json();
    console.log("returning from fetchModelServer...")
    return { data, error: null };

}

export default fetchModelServer;
