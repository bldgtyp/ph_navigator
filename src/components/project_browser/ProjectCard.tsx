import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export type ProjectDataType = {
    display_name: string;
    identifier: string;
};

type ProjectCardProps = ProjectDataType & { teamId: string | undefined; };

export function ProjectCard(props: ProjectCardProps) {
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
    );
}
