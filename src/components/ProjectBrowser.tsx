import '../styles/ProjectBrowser.css';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import { fetchModelServer } from '../hooks/fetchModelServer';
import { useNavigate } from "react-router-dom";

type ProjectDataType = {
    display_name: string;
    identifier: string;
}

type ProjectCardProps = ProjectDataType & { teamId: string | undefined };

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

function ProjectBrowser() {
    const [projectDataList, setProjectDataList] = useState<ProjectDataType[]>([{ display_name: "", identifier: "" }])
    const { teamId } = useParams();

    useEffect(() => {
        fetchModelServer<ProjectDataType[]>(`${teamId}/get_project_listing`).then((response) => {
            setProjectDataList(response);
        });
    }, [teamId]);

    return (
        <Paper className="project-browser">
            <h2 className="project-browser-team-name">Team: {teamId}</h2>
            <div className="project-browser-cards">
                <ProjectCard display_name={"..."} identifier={""} key={""} teamId={teamId} />
                {projectDataList.map((d) => {
                    return <ProjectCard {...d} key={d.identifier} teamId={teamId} />
                })}
            </div>
        </Paper>
    );
}

export default ProjectBrowser;