import '../../styles/ProjectBrowser.css';
import { useParams } from "react-router-dom";
import { Paper } from "@mui/material";
import { Public } from './PublicView';
import { TeamView } from './TeamView';

function ProjectBrowser() {
    const { teamId } = useParams();

    // If the team is NOT public, show their own team's projects
    // Otherwise, show the public projects page.
    return (
        <Paper className="project-browser">
            <h2 className="project-browser-team-name">Team: {teamId}</h2>
            {teamId === "public" ? <Public /> : <TeamView />}
        </Paper>
    );
}

export default ProjectBrowser;