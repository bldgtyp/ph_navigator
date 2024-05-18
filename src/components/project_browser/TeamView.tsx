import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { fetchModelServer } from '../../hooks/fetchModelServer';
import { putModelServer } from '../../hooks/putModelServer';
import { GitHubPathElement } from '../../types/github/PathElement';
import { Project } from '../../types/fake_database/Project';
import { ProjectDataType, ProjectCard } from './ProjectCard';

import { Dialog } from '@mui/material';

/**
 * Checks if the given child is an HBJSON file.
 * @param child - The GitHubPathElement representing the child.
 * @returns True if the child is an HBJSON file, false otherwise.
 */
function childIsHBJSONFile(child: GitHubPathElement): boolean {
    return child.type === 'file' && child.name.endsWith(".hbjson");
};

/**
 * Removes the file extension (.hbjson) from the given full name.
 * 
 * @param fullName - The full name of the file.
 * @returns The file name without the extension.
 */
function hbjsonFileName(fullName: string): string {
    // Break off the file extension (.hbjson)
    return fullName.substring(0, fullName.lastIndexOf('.'));
};

/**
 * Adds models to the database from GitHub data.
 * 
 * @param teamId - The ID of the team.
 * @param project_name - The name of the project.
 * @param ghPathElement - The GitHub path element.
 */
function addModelsToDBFromGHData(teamId: string | undefined, project_name: string, ghPathElement: GitHubPathElement) {
    console.log("addModelsToDBFromGHData", teamId, project_name);
    ghPathElement.children.forEach((child) => {
        const modelName = hbjsonFileName(child.name);
        if (childIsHBJSONFile(child)) {
            const payload = {
                display_name: modelName,
                hbjson_url: child.download_url,
            }
            putModelServer(`${teamId}/${project_name}/add_new_model_to_project`, payload);
        }
    });
};

/**
 * Adds projects to the database from GitHub data.
 * 
 * @param teamId - The ID of the team.
 * @param ghPathElements - An array of GitHub path elements.
 */
function addProjectsToDBFromGHData(teamId: string | undefined, ghPathElements: GitHubPathElement[]) {
    console.log("addProjectsToDBFromGHData", teamId);
    ghPathElements.forEach((ghPathElement) => {
        if (ghPathElement.type == 'dir') {
            putModelServer<Project>(`${teamId}/add_new_project_to_team`, { display_name: ghPathElement.name })
                .then((newProject) => {
                    addModelsToDBFromGHData(teamId, newProject.display_name, ghPathElement);
                });
        };
    });
};

export function TeamView() {
    const { teamId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [projectDataList, setProjectDataList] = useState<ProjectDataType[]>([{ display_name: "", identifier: "" }]);

    useEffect(() => {
        console.log("TeamView useEffect", teamId, "- - - - - - - - - -");
        setIsLoading(true);
        fetchModelServer<GitHubPathElement[]>("get_team_project_data_from_source", process.env.REACT_APP_TEST_GH_ACCESS_KEY)
            // Load all the Team's Project Data FROM the source TO the server
            .then((response: GitHubPathElement[]) => {
                addProjectsToDBFromGHData(teamId, response);
            })
            .then(() => {
                // Get all the Team's Project Data FROM the server
                fetchModelServer<ProjectDataType[]>(`${teamId}/get_projects`, process.env.REACT_APP_TEST_GH_ACCESS_KEY)
                    .then((response) => {
                        setProjectDataList(response);
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
