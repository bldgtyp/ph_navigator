// A Single Team

import { Route, Routes } from "react-router-dom";
import Project from './Project';
import ProjectBrowser from './ProjectBrowser';

function Team() {

    return (
        <Routes>
            <Route path="*" element={<ProjectBrowser />} />
            <Route path=":projectId/*" element={<Project />} />
        </Routes>
    );
}

export default Team;