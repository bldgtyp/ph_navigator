// A Single Team

import { Route, Routes } from "react-router-dom";
import ProjectBrowser from './ProjectBrowser';
import Project from './Project';

// If there is a projectId in the route, then just go straight to showing the project.
// Otherwise, if no projectId, then show the team's project browser page.

function Team() {
    return (
        <Routes>
            <Route path=":projectId/*" element={<Project />} />
            <Route path="*" element={<ProjectBrowser />} />
        </Routes>
    );
}

export default Team;