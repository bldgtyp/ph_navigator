import '../styles/ProjectBrowser.css';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import { fetchModelServer } from '../hooks/fetchModelServer';
import { useNavigate } from "react-router-dom";
import { GitHubPathElement } from '../types/github/PathElement';
import putModelServer from '../hooks/putModelServer';


type ProjectDataType = {
    display_name: string;
    identifier: string;
}

type ProjectCardProps = ProjectDataType & { teamId: string | undefined };


function childIsHBJSONFile(child: GitHubPathElement): boolean {
    return child.type === 'file' && child.name.endsWith(".hbjson");
}

function hbjsonFileName(fullName: string): string {
    return fullName.substring(0, fullName.lastIndexOf('.'));
}

// If the team IS public, .... 
function Public() {
    return (
        <Paper className="public">
            <h2>Public Projects</h2>
            <p>Public projects are available to all users</p>
        </Paper>
    );
}


function ProjectCard(props: ProjectCardProps) {
    const { display_name, identifier, teamId } = props;
    const navigate = useNavigate();

    return (
        <Paper
            className={"project-card " + (display_name === "..." ? "project-card-new" : "")}
            onClick={() => {
                if (teamId !== undefined) {
                    navigate(`/${teamId}/${display_name}`);
                }
            }}>
            <p className="card-id">ID: {identifier}</p>
            <p className="card-name">Project: {display_name}</p>
            {display_name === "..." ? <p className="card-description">Start a new project</p> : null}
        </Paper>
    )
}

// If the team is NOT public, show their projects
function ProjectCards() {
    const { teamId, projectId, modelId } = useParams();
    const [projectDataList, setProjectDataList] = useState<ProjectDataType[]>([{ display_name: "", identifier: "" }])

    // Walk through the team's file repository and setup all the models for the team on the server
    // useEffect(() => {
    //     fetchModelServer<GitHubPathElement[]>("test", process.env.REACT_APP_TEST_GH_ACCESS_KEY)
    //         .then((response: GitHubPathElement[]) => {
    //             response.forEach((element) => {
    //                 if (element.type == 'dir') {
    //                     putModelServer<any>(`${teamId}/create_new_project`, { display_name: element.name })
    //                         .then((newProject) => {
    //                             element.children.forEach((child) => {
    //                                 if (childIsHBJSONFile(child)) {
    //                                     const modelName = hbjsonFileName(child.name);
    //                                     putModelServer(`${teamId}/${newProject.project_id}/create_new_model`, modelName)
    //                                 }
    //                             });
    //                         });
    //                 };
    //             });
    //         });
    // }, [teamId]);

    // Get a List of all this team's projects from the server
    useEffect(() => {
        fetchModelServer<ProjectDataType[]>(`${teamId}/get_project_listing`, process.env.REACT_APP_TEST_GH_ACCESS_KEY)
            .then((response) => {
                setProjectDataList(response);
            });
    }, [teamId]);


    return (
        <div className="project-browser-cards">
            <ProjectCard display_name={"..."} identifier={""} key={""} teamId={teamId} />
            {projectDataList.map((d) => {
                return <ProjectCard {...d} key={d.identifier} teamId={teamId} />
            })}
        </div>
    )
}


function ProjectBrowser() {
    const { teamId } = useParams();

    return (
        <Paper className="project-browser">
            <h2 className="project-browser-team-name">Team: {teamId}</h2>
            {teamId === "public" ? <Public /> : ProjectCards()}
        </Paper>
    );
}

export default ProjectBrowser;