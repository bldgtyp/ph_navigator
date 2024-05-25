import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { fetchModelServer } from '../../hooks/fetchModelServer';
import { putModelServer } from '../../hooks/putModelServer';
import { Project } from '../../types/fake_database/Project';
import { ProjectDataType, ProjectCard } from './ProjectCard';
import { ProjectListingTable } from '../../types/airtable/project_listing_table';
import { ProjectTable } from '../../types/airtable/project_table';
import { Dialog } from '@mui/material';

function stringToUrlSafe(str: string) {
    return str.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_").toLowerCase();
}

async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`
        alert(message);
        return null;
    } else {
        return data;
    }
};

export function TeamView() {
    const { teamId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [projectDataList, setProjectDataList] = useState<ProjectDataType[]>([{ display_name: "", identifier: "" }]);

    useEffect(() => {
        const tkn = process.env.REACT_APP_PH_NAV_AIRTABLE_TEST_TOKEN
        console.log(`- - - - - - - - - - TeamView useEffect ${teamId} - - - - - - - - - -`);
        console.log(`process.env.REACT_APP_TEST_GH_ACCESS_KEY: ${tkn}`,)
        setIsLoading(true);

        // 1) PUT all the Team's Project metadata ONTO the SERVER from the SOURCE
        fetchWithModal<ProjectListingTable>("get_project_metadata_from_source", tkn)
            .then((response) => {
                if (!response) { return null };

                // Create a new project on the server for each record
                response.records.map((record) => {
                    const project_name = stringToUrlSafe(record.fields.PROJECT_NUMBER);
                    return putModelServer<Project>(`${teamId}/add_new_project_to_team`, { display_name: project_name })
                        .then(() => {

                            // Get the model listing for the project from the source
                            return fetchWithModal<ProjectTable>("get_model_metadata_from_source", tkn, { "app_id": record.fields.APP_ID, "tbl_id": record.fields.TABLE_ID })
                                .then((response) => {
                                    if (!response) { return null };

                                    // Create a new ModelView on the Project for each record
                                    response.records.map((record: any) => {
                                        const payload = {
                                            display_name: stringToUrlSafe(record.fields.DISPLAY_NAME),
                                            // TODO: handle multiple files, or None...
                                            hbjson_url: record.fields.HBJSON_FILE[0].url,
                                        }
                                        return putModelServer(`${teamId}/${project_name}/add_new_model_view_to_project`, payload);
                                    });
                                });
                        });
                });
            }).then(() => {
                // 2) Now GET all the Team's Project metadata FROM the SERVER
                // TODO: can this be done during tha first fetch? Try....
                return fetchWithModal<ProjectDataType[]>(`${teamId}/get_projects`, tkn)
                    .then((response) => {
                        if (response) {
                            setProjectDataList(response);
                        };
                        setIsLoading(false);
                    });
            });

    }, [teamId]);

    return (
        <div className="project-browser-cards">
            <Dialog open={isLoading}>
                <div>Loading...</div>
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