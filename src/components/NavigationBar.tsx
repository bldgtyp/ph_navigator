import "../styles/NavBar.css";
import React from 'react';
import { ReactComponent as NavIcon } from '../icons/navigator.svg';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchModelServer } from "../hooks/fetchModelServer";

function ModelSelector(props: { teamId: string | undefined, projectId: string | undefined, models: string[] | undefined }) {
    const { teamId, projectId, models } = props;
    const [value, setValue] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        setValue(event.target.value);
        navigate(`/${teamId}/${projectId}/${event.target.value}`);
    };

    return (
        <>

            <select className="nav-bar-model-name" value={value} onChange={handleChange}>
                <option value="">...</option>
                {models?.map((model) => {
                    return <option key={model} value={model}>{model}</option>
                })}
            </select>
        </>
    )
}

function NavigationBar() {
    const navigate = useNavigate();
    const { teamId, projectId } = useParams();
    const [models, setModels] = useState<string[] | undefined>(["..."]);

    useEffect(() => {
        fetchModelServer<string[]>(`${teamId}/${projectId}/get_model_names`).then(data => {
            setModels(data);
        });
    }, [teamId, projectId]);

    return (
        <div className="nav-bar">
            <div className='nav-bar-home-link' onClick={() => { navigate(`/${teamId}`); }}>
                <NavIcon height={20} style={{ paddingRight: '5px' }} />
                <p className='nav-bar-team-name'>{teamId} /</p>
            </div>
            <p className='nav-bar-project-name'>{projectId} /</p>
            <ModelSelector teamId={teamId} projectId={projectId} models={models} />
        </div>
    );
}

export default NavigationBar;