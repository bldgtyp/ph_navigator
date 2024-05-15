import constants from "../data/constants.json";

export async function putModelServer<T>(endpoint: string, data: any | null = null): Promise<T> {
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
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson: { "message": string } = await response.json();
    return JSON.parse(responseJson['message']);
}

export default putModelServer;
