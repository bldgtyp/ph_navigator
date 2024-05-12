import "../styles/NavBar.css";
import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchModelServer } from "../hooks/fetchModelServer";

type ProjectListingType = { [key: string]: string[] };

function ProjectSelector(props: { projects: ProjectListingType, setProject: (project: string | undefined) => void }) {
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
                {Object.keys(projects).map((project) => {
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

    const [projects, setProjects] = useState<ProjectListingType>({});
    const [project, setProject] = useState<string | undefined>(undefined);
    const [models, setModels] = useState<string[] | undefined>(["..."]);

    // Download the list of projects and their models:
    //{
    //     "proj-2305": ["test_model1", "test_model2"],
    //     "proj-2306": ["test_model3", "test_model4"],
    // }
    useEffect(() => {
        fetchModelServer<ProjectListingType>(`get_model_listing`).then(data => {
            setProjects(data);
        });
    }, []);

    // Set the Model when the project changes
    useEffect(() => {
        if (project !== undefined && projects[project] !== undefined) {
            setModels(projects[project]);
        }
    }, [project]);

    return (
        <p className="nav-bar"><ProjectSelector projects={projects} setProject={setProject} /> | <ModelSelector project={project} models={models} /></p>
    );
}

export default NavigationBar;