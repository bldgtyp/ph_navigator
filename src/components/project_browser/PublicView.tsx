import { useParams, useNavigate } from "react-router-dom";
import { fetchModelServer } from "../../hooks/fetchModelServer";

async function fetchWithModal<T>(endpoint: string, token: string | undefined = "", params: any = {}) {
    const { data, error } = await fetchModelServer<T | null>(endpoint, token, params);
    if (error) {
        const message = `Error getting data: ${error}`
        alert(message);
        return null;
    } else {
        return data;
    }
};

export function Public() {
    const navigate = useNavigate();
    const { teamId } = useParams();
    function handleOnClick() {
        // Create a new Project on the Public Team
        fetchWithModal<{ display_name: string }>(`${teamId}/create_new_project`)
            .then(data => {
                if (!data) { return null }
                const newProjectId = data.display_name;
                fetchWithModal<{ display_name: string }>(`${teamId}/${newProjectId}/create_new_model_view`)
                    .then(data => {
                        if (!data) { return null }
                        // Create a new, empty Model in the Project
                        // Navigate to the new Model. This should automatically load Uploader.
                        const newModelId = data.display_name;
                        navigate(`/${teamId}/${newProjectId}/${newModelId}`);
                    });
            });
    };

    return (
        <div className="public">
            <p>Public projects are available to all users</p>
            <button onClick={handleOnClick}>Go to the Free Viewer</button>
        </div>
    );
}
