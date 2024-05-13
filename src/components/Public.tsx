// The Public Viewer

import { Route, Routes, useParams } from "react-router-dom";
import Project from './Project';
import { useEffect } from "react";
import { putModelServer } from "../hooks/putModelServer";
import { useNavigate } from "react-router-dom";

function Public() {
    const { teamId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        putModelServer(`public/create_new_project`).then((response) => {
            navigate(`/${teamId}/${response.project_id}`);
        });

    }, [teamId]);

    return (
        <Routes>
            <Route path=":projectId/*" element={<Project />} />
        </Routes>
    );
}

export default Public;