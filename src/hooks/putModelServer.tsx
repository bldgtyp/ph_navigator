import constants from "../data/constants.json";

export async function putModelServer<T>(endpoint: string, data: any | null = null): Promise<T> {
    console.log('putModelServer', endpoint, data);
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    const response = await fetch(API_ENDPOINT, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const txt: any = await response.json();
        throw new Error(`HTTP error! status: ${response.status} | ${txt.detail}`);
    }

    const responseJson = await response.json();
    return responseJson;
}

export default putModelServer;
