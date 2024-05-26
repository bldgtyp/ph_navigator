import "../styles/NavBar.css";
import React, { useEffect } from 'react';
import { ReactComponent as NavIcon } from '../icons/navigator.svg';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Tooltip } from '@mui/material';
import Link from '@mui/icons-material/Link';
import { ModelView } from "../types/fake_database/ModelView";

function ModelSelector(props: { teamId: string | undefined, projectId: string | undefined, modelsViewList: ModelView[] }) {
    const { teamId, projectId, modelsViewList } = props;
    const [selectedModelName, setSelectedModelName] = React.useState("");
    const [activeModelHbJsonURL, setActiveModelHbJsonURL] = React.useState("");
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        const selectedValue = event.target.value;
        setSelectedModelName(selectedValue);
        updateActiveModelHbJsonURL(selectedValue);
        navigate(`/${teamId}/${projectId}/${selectedValue}`);
    };

    const updateActiveModelHbJsonURL = (selectedValue: string) => {
        const selectedModel = modelsViewList.find(model => model.display_name === selectedValue);
        if (selectedModel) {
            setActiveModelHbJsonURL(selectedModel.hbjson_url);
        }
    };

    const modelViewNames = () => {
        return modelsViewList?.map((model) => {
            return <option key={model.display_name} value={model.display_name}>{model.display_name}</option>
        });
    };

    useEffect(() => {
        // Make sure the populate the Active URL on the first render
        if (modelsViewList.length > 0) {
            setActiveModelHbJsonURL(modelsViewList[0].hbjson_url);
        }
    }, [modelsViewList]);


    return (
        <>
            <select className="nav-bar-model-name" value={selectedModelName} onChange={handleChange}>
                {modelViewNames()}
            </select>

            <Tooltip title={activeModelHbJsonURL} placement="right">
                <a className="nav-bar-model-link " href={activeModelHbJsonURL}>
                    <Link style={{ marginLeft: '5px', cursor: 'pointer', color: "#565656" }} fontSize="small" />
                </a>
            </Tooltip>
        </>
    )
}

function NavigationBar(props: { modelsViewList: ModelView[] }) {
    const { modelsViewList } = props;
    const { teamId, projectId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="nav-bar">
            <div className='nav-bar-home-link' onClick={() => { navigate(`/${teamId}`); }}>
                <NavIcon height={20} style={{ paddingRight: '5px' }} />
                <p className='nav-bar-team-name'>{teamId} /</p>
            </div>
            <p className='nav-bar-project-name'>{projectId} /</p>
            <ModelSelector teamId={teamId} projectId={projectId} modelsViewList={modelsViewList} />
        </div>
    );
}

export default NavigationBar;