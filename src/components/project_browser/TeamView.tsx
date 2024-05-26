import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { fetchModelServer } from '../../hooks/fetchModelServer';
import { putModelServer } from '../../hooks/putModelServer';
import { Project } from '../../types/fake_database/Project';
import { ProjectDataType, ProjectCard } from './ProjectCard';
import { ProjectListingTable } from '../../types/airtable/project_listing_table';
import { ProjectTable } from '../../types/airtable/project_table';
import { Dialog } from '@mui/material';
import MoonLoader from "react-spinners/MoonLoader";

/**
 * Converts a string to a URL-safe format.
 * Removes special characters, replaces spaces with underscores, and converts to lowercase.
 *
 * @param str - The string to convert.
 * @returns The URL-safe string.
 */
function stringToUrlSafe(str: string) {
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
        display_name: stringToUrlSafe(record.fields.DISPLAY_NAME),
        hbjson_url: record.fields.HBJSON_FILE[0].url,
    }
    await putModelServer(`${teamId}/${project_name}/add_new_model_view_to_project`, payload);
}


/**
 * Create a Project and the associated Model-Views for a Team.
 * 
 * @param teamId - The ID of the team.
 * @param record - The record containing Project and Model-View information.
 * @param tkn - The token for authentication.
 * @returns A Promise that resolves when all model views are created.
 */
async function createProjectAndModelViews(teamId: string | undefined, record: any, tkn: string | undefined) {
    const project_name = stringToUrlSafe(record.fields.PROJECT_NUMBER);
    await putModelServer<Project>(`${teamId}/add_new_project_to_team`, { display_name: project_name });

    const response = await fetchWithModal<ProjectTable>("get_model_metadata_from_source", tkn, { "app_id": record.fields.APP_ID, "tbl_id": record.fields.TABLE_ID });
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
async function configureProjectListOnServer(teamId: string | undefined, projectListingTable: ProjectListingTable, tkn: string | undefined) {
    const projectPromises = projectListingTable.records.map((record) => createProjectAndModelViews(teamId, record, tkn));
    await Promise.all(projectPromises);
}


/**
 * Fetches the Team's project list data from the server based on the team ID and token provided.
 * 
 * @param {string | undefined} teamId - The ID of the team.
 * @param {string | undefined} tkn - The token used for authentication.
 * @param {any} setProjectDataList - The function to set the project data list.
 * @returns {Promise<void>} - A promise that resolves when the project data is fetched and set.
 */
async function getProjectListDataFromServer(teamId: string | undefined, tkn: string | undefined, setProjectDataList: any): Promise<void> {
    const response = await fetchWithModal<ProjectDataType[]>(`${teamId}/get_projects`, tkn);
    if (response) {
        setProjectDataList(response);
    }
}


export function TeamView() {
    const { teamId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [projectDataList, setProjectDataList] = useState<ProjectDataType[]>([{ display_name: "", identifier: "" }]);

    useEffect(() => {
        const fetchProjectList = async () => {
            try {
                console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
                console.log(`Loading '${teamId}' TeamView Project List`);
                console.log(`process.env.REACT_APP_TEST_GH_ACCESS_KEY: ${tkn}`,);

                // Get the Project Listing from the Airtable Source
                const projectListing = await fetchWithModal<ProjectListingTable>("get_project_metadata_from_source", tkn)
                if (!projectListing) { return null }

                // Put the Project Listing to the Server, and then load the Projects for display
                await configureProjectListOnServer(teamId, projectListing, tkn)
                await getProjectListDataFromServer(teamId, tkn, setProjectDataList)
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
                console.log(`Done loading '${teamId}' TeamView Project List.`)
            }
        };

        const tkn = process.env.REACT_APP_PH_NAV_AIRTABLE_TEST_TOKEN
        fetchProjectList()

    }, [teamId]);

    return (
        <div className="project-browser-cards">
            <Dialog className="model-loading" open={isLoading}>
                <div className="model-loading">
                    <div>Please wait while the Team&apos;s Projects are Loaded.</div>
                    <MoonLoader
                        color="#1976d2"
                        cssOverride={{
                            display: "block",
                            margin: "0 auto",
                            padding: "8px",
                        }}
                        size="25px"
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </Dialog>
            {!isLoading && (
                <>
                    {projectDataList.map((d) => {
                        return <ProjectCard {...d} key={d.identifier} teamId={teamId} />;
                    })}
                </>
            )}
        </div>
    );
}