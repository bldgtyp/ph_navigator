import '../styles/Toolbar.css';
import React, { useState } from 'react';
import { Stack } from "@mui/material";
import { ReactComponent as RulerIcon } from '../icons/Ruler.svg';
import { ReactComponent as SurfaceIcon } from '../icons/Surface.svg';
import { ReactComponent as NoteIcon } from '../icons/Note.svg';
import { ReactComponent as DuctIcon } from '../icons/Ducts.svg';
import { ReactComponent as PipeIcon } from '../icons/Piping.svg';
import { ReactComponent as SpaceIcon } from '../icons/Space.svg';
import { ReactComponent as SunPathIcon } from '../icons/SunPath.svg';
import { states, AppState } from './AppState';


const icons = [<SurfaceIcon />, <RulerIcon />, <NoteIcon />, <SpaceIcon />, <SunPathIcon />, <DuctIcon />, <PipeIcon />];

interface ToolbarProps {
    appStateRef: React.MutableRefObject<AppState>;
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Toolbar = (props: ToolbarProps) => {
    const { appStateRef, appState, setAppState } = props;
    const [activeButton, setActiveButton] = useState<number | null>(null);

    return (
        <Stack direction="row" spacing={2} className="toolbar">
            {icons.map((icon, index) => (
                <button
                    key={index}
                    className={`round-button ${activeButton === index ? 'active' : ''}`}
                    onClick={() => {
                        // Toolbar Index starts ay 0, but AppState starts at 1
                        if (index + 1 === appState.state) {
                            // Turn the Current State 'Off'
                            appStateRef.current = states[0];
                            setAppState(states[0]);
                            setActiveButton(null);
                        } else {
                            // Set the new State 'On'
                            var new_app_state_number: number = index + 1;
                            appStateRef.current = states[new_app_state_number];
                            setAppState(states[new_app_state_number]);
                            setActiveButton(index);
                        }
                    }}
                >
                    {icon}
                </button>
            ))}
        </Stack>
    );
};

export default Toolbar;