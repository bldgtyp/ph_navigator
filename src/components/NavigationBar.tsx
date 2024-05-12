import { useEffect, useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

function ProjectSelector(props: { projects: string[], setProject: (project: string | undefined) => void }) {
    const { projects, setProject } = props;
    const [value, setValue] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        setValue(event.target.value);
        setProject(event.target.value);
        navigate(`/${event.target.value}`);
    };

    return (
        <>
            <select className="project-selector" value={value} onChange={handleChange}>
                <option value="">...</option>
                {projects.map((project) => {
                    return <option key={project} value={project}>{project}</option>
                })}
            </select>
        </>
    )
}

function ModelSelector(props: { project: string | undefined, models: string[] | undefined }) {
    const { project, models } = props;
    const [value, setValue] = React.useState('');
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        setValue(event.target.value);
        navigate(`/${project}/${event.target.value}`);
    };

    return (
        <>
            <select className="model-selector" value={value} onChange={handleChange}>
                <option value="">...</option>
                {models?.map((model) => {
                    return <option key={model} value={model}>{model}</option>
                })}
            </select>
        </>
    )
}

function NavigationBar() {
    type ProjectMap = { [key: string]: string[] };

    const testData: ProjectMap = {
        "2305": ["test_model", "test_model"],
        "2306": ["test_model", "test_model"],
    }

    const projects = Object.keys(testData);
    const [project, setProject] = useState<string | undefined>(undefined);
    const [models, setModels] = useState<string[] | undefined>(["..."]);

    useEffect(() => {
        if (project !== undefined) {
            setModels(testData[project]);
        }
    }, [project]);

    return (
        <p className="nav-bar"><ProjectSelector projects={projects} setProject={setProject} /> | <ModelSelector project={project} models={models} /></p>
    );
}

export default NavigationBar;