import constants from "../data/constants.json";
import axios from 'axios';

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
