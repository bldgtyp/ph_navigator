import constants from "../data/constants.json";
import axios from 'axios';

/**
 * Sends a POST request to the server with the provided endpoint and form data.
 * 
 * @param endpoint - The endpoint to send the request to.
 * @param formData - The form data to include in the request.
 * @param setUploadProgress - A state setter function to update the upload progress.
 * @returns A Promise that resolves to the server response message.
 * @throws An error if there is an HTTP error or no response from the server.
 */
export async function postModelServeFile(
    endpoint: string,
    formData: FormData | null = null,
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
) {
    console.log("postModelServeFile", endpoint, formData);
    const API_BASE_URL: string = process.env.REACT_APP_API_URL || constants.RENDER_API_BASE_URL;
    const API_ENDPOINT: string = API_BASE_URL + endpoint;
    if (formData === null) {
        return;
    }

    try {
        const response = await axios.post(API_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent !== undefined && progressEvent.total !== undefined) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            }
        })

        const responseJson: { "message": string } = response.data;
        return responseJson['message'];
    } catch (error: any) {
        if (error.response) {
            throw new Error(`HTTP error! status: ${error.response.status}`);
        } else if (error.request) {
            throw new Error('No response from server');
        } else {
            throw new Error('Error', error.message);
        }
    }
}

export default postModelServeFile;
