// A Single Team

import { Route, Routes } from "react-router-dom";
import Project from './Project';
import ProjectBrowser from './ProjectBrowser';

function Team() {

    return (
        <div>
            <Routes>
                <Route path="*" element={<ProjectBrowser />} />
                <Route path=":projectId/*" element={<Project />} />
            </Routes>
        </div>
    );
}

export default Team;