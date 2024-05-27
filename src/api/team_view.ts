import { fetchModelServer } from '../hooks/fetchModelServer';
import { putModelServer } from '../hooks/putModelServer';
import { Project } from '../types/fake_database/Project';
import { ProjectDataType } from '../components/project_browser/ProjectCard';
import { ProjectListingTable } from '../types/airtable/project_listing_table';
import { ProjectTable } from '../types/airtable/project_table';


/**
 * Converts a string to a URL-safe format.
 * Removes special characters, replaces spaces with underscores, and converts to lowercase.
 *
 * @param str - The string to convert.
 * @returns The URL-safe string.
 */
function _stringToUrlSafe(str: string) {
    return str.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_").toLowerCase();
}


/**
 * Helper function to fetch data from the server with a modal for error handling.
 *
 * @param endpoint - The endpoint to fetch data from.
 * @param token - The authentication token (optional).
 * @param params - Additional parameters for the request (optional).
 * @returns A Promise that resolves to the fetched data or null if there was an error.
 */
async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
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
 * Creates Model-Views for a given Team's Project.
 * 
 * @param teamId - The ID of the team.
 * @param project_name - The name of the project.
 * @param record - The record containing the model view data.
 * @returns A promise that resolves when the model views are created.
 */
async function createModelViews(teamId: string | undefined, project_name: string, record: any) {
    const payload = {
        display_name: _stringToUrlSafe(record.fields.DISPLAY_NAME),
        hbjson_url: record.fields.HBJSON_FILE[0].url,
    }
    await putModelServer(`${teamId}/${project_name}/add_new_model_view_to_project`, payload);
}


/**
 * Create a Project and the associated Model-Views for a Team.
 * 
 * @param teamId - The ID of the team.
 * @param record - The record containing Project and Model-View information.
 * @param token - The token for authentication.
 * @returns A Promise that resolves when all model views are created.
 */
async function createProjectAndModelViews(
    teamId: string | undefined, record: any, token: string | undefined
): Promise<void | null> {
    const project_name = _stringToUrlSafe(record.fields.PROJECT_NUMBER);
    await putModelServer<Project>(`${teamId}/add_new_project_to_team`, { display_name: project_name });

    const response = await fetchWithModal<ProjectTable>("get_model_metadata_from_source", token, { "app_id": record.fields.APP_ID, "tbl_id": record.fields.TABLE_ID });
    if (!response) { return null; }

    const modelPromises = response.records.map((record: any) => createModelViews(teamId, project_name, record));
    await Promise.all(modelPromises);
}


/**
 * Configures the Team's Project list on the server.
 * 
 * @param teamId - The ID of the team.
 * @param projectListingTable - The project listing table.
 * @param tkn - The token.
 * @returns A promise that resolves when all projects are created and model views are generated.
 */
async function configureProjectListOnServer(
    teamId: string | undefined, projectListingTable: ProjectListingTable, tkn: string | undefined
): Promise<void> {
    const projectPromises = projectListingTable.records.map((record) => createProjectAndModelViews(teamId, record, tkn));
    await Promise.all(projectPromises);
}


/**
 * Retrieves the project listing from AirTable.
 * @param token - The token used for authentication.
 * @returns A promise that resolves to the project listing table.
 */
async function getProjectListingFromAirTable(
    token: string | undefined
): Promise<ProjectListingTable | null> {
    return await fetchWithModal<ProjectListingTable>("get_project_metadata_from_source", token)
}


/**
 * Retrieves project list data for a specific team.
 * 
 * @param teamId - The ID of the team.
 * @param token - The authentication token.
 * @returns A promise that resolves to an array of ProjectDataType or null.
 */
export async function getProjectListData(
    teamId: string | undefined, token: string | undefined
): Promise<ProjectDataType[] | null> {
    const projectListing = await getProjectListingFromAirTable(token)
    if (projectListing !== null) {
        await configureProjectListOnServer(teamId, projectListing, token)
    }
    return await fetchWithModal<ProjectDataType[]>(`${teamId}/get_projects`, token);
}
