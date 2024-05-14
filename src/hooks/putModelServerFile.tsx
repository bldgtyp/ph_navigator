import constants from "../data/constants.json";
import axios from 'axios';

export async function putModelServeFile(
    endpoint: string,
    formData: FormData | null = null,
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
) {
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
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`HTTP error! status: ${error.response.status}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error', error.message);
        }
    }
}

export default putModelServeFile;
