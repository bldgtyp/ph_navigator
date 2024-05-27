import { fetchModelServer } from "../hooks/fetchModelServer";
import { ModelView } from "../types/fake_database/ModelView";


/**
 * Fetches data from the server using the specified endpoint and parameters.
 * Displays an alert if there is an error and returns the fetched data.
 *
 * @param endpoint - The endpoint to fetch data from.
 * @param token - The authentication token (optional).
 * @param params - Additional parameters for the request (optional).
 * @returns A promise that resolves to the fetched data or null if there is an error.
 */
async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}): Promise<T | null> {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`;
        alert(message);
        return null;
    } else {
        return data;
    }
}


/**
 * Retrieves a list of all the model-view objects for a project.
 * 
 * @param teamId - The ID of the team.
 * @param projectId - The ID of the project.
 * @returns A promise that resolves to an array of ModelView objects, or null if either `teamId` or `projectId` is undefined.
 */
export async function getProjectModelViews(
    teamId: string | undefined, projectId: string | undefined
): Promise<ModelView[] | null> {
    if (teamId === undefined || projectId === undefined) { return null; }
    return await fetchWithModal<ModelView[]>(`${teamId}/${projectId}/get_models`);
}


/**
 * Retrieves the model view for a given team, project, and model ID.
 * 
 * @param teamId - The ID of the team.
 * @param projectId - The ID of the project.
 * @param modelId - The ID of the model.
 * @returns A Promise that resolves to the ModelView object, or null if any of the parameters are undefined.
 */
export async function getModelView(
    teamId: string | undefined, projectId: string | undefined, modelId: string | undefined
): Promise<ModelView | null> {
    if (teamId === undefined || projectId === undefined || modelId === undefined) { return null; }
    return await fetchWithModal<ModelView>(`${teamId}/${projectId}/get_model`, "", { model_name: `${modelId}` });
}