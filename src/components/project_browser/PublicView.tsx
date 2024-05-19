import { useParams, useNavigate } from "react-router-dom";
import { fetchModelServer } from "../../hooks/fetchModelServer";

export function Public() {
    const navigate = useNavigate();
    const { teamId } = useParams();
    function handleOnClick() {
        // Create a new Project on the Public Team
        // fetchModelServer<{ display_name: string }>(`${teamId}/create_new_project`)
        //     .then(data => {
        //         const newProjectId = data.display_name;
        //         fetchModelServer<{ display_name: string }>(`${teamId}/${newProjectId}/create_new_model_view`)
        //             .then(data => {
        //                 // Create a new, empty Model in the Project
        //                 // Navigate to the new Model. This should automatically load Uploader.
        //                 const newModelId = data.display_name;
        //                 navigate(`/${teamId}/${newProjectId}/${newModelId}`);
        //             });
        //     });
    };

    return (
        <div className="public">
            <p>Public projects are available to all users</p>
            <button onClick={handleOnClick}>Go to the Free Viewer</button>
        </div>
    );
}
