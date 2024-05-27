import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
// import { fetchModelServer } from '../../hooks/fetchModelServer';
import { putModelServer } from '../../hooks/putModelServer';
import { GitHubPathElement } from '../../types/github/PathElement';
import { Project } from '../../types/fake_database/Project';
import ProjectCard, { ProjectDataType } from './ProjectCard';

import { Dialog } from '@mui/material';


function childIsHBJSONFile(child: GitHubPathElement): boolean {
    // Check if the child is of type "file" and ends with ".hbjson"
    return child.type === 'file' && child.name.endsWith(".hbjson");
};


function hbjsonFileName(fullName: string): string {
    // Break off the file extension (.hbjson)
    return fullName.substring(0, fullName.lastIndexOf('.'));
};


function addModelsToDBFromGHData(teamId: string | undefined, project_name: string, ghPathElement: GitHubPathElement) {
    console.log("addModelsToDBFromGHData", teamId, project_name);
    ghPathElement.children.forEach((child) => {
        const modelName = hbjsonFileName(child.name);
        if (childIsHBJSONFile(child)) {
            const payload = {
                display_name: modelName,
                hbjson_url: child.download_url,
            }
            putModelServer(`${teamId}/${project_name}/add_new_model_view_to_project`, payload);
        }
    });
};


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
        console.log("process.env.REACT_APP_TEST_GH_ACCESS_KEY:", process.env.REACT_APP_TEST_GH_ACCESS_KEY)
        setIsLoading(true);

        // fetchModelServer<GitHubPathElement[]>("get_team_project_data_from_source", process.env.REACT_APP_TEST_GH_ACCESS_KEY)
        //     // Load all the Team's Project Data FROM the source TO the server
        //     .then((response: GitHubPathElement[]) => {
        //         addProjectsToDBFromGHData(teamId, response);
        //     })
        //     .then(() => {
        //         // Get all the Team's Project Data FROM the server
        //         fetchModelServer<ProjectDataType[]>(`${teamId}/get_projects`, process.env.REACT_APP_TEST_GH_ACCESS_KEY)
        //             .then((response) => {
        //                 setProjectDataList(response);
        //                 setIsLoading(false);
        //             });
        //     });

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
