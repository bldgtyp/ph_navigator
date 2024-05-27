// Menu Bar for setting the App State and Visibility

import '../styles/VizStateMenuBar.css';
import { useState } from 'react';
import { Stack } from "@mui/material";
import { ReactComponent as RulerIcon } from '../icons/Ruler.svg';
import { ReactComponent as SurfaceIcon } from '../icons/Surface.svg';
import { ReactComponent as NoteIcon } from '../icons/Note.svg';
import { ReactComponent as DuctIcon } from '../icons/Ducts.svg';
import { ReactComponent as PipeIcon } from '../icons/Piping.svg';
import { ReactComponent as SpaceIcon } from '../icons/Space.svg';
import { ReactComponent as SunPathIcon } from '../icons/SunPath.svg';
import { useAppVizStateContext } from '../contexts/app_viz_state_context';

const icons = [
    <NoteIcon key={1} />,
    <SpaceIcon key={2} />,
    <SunPathIcon key={3} />,
    <DuctIcon key={4} />,
    <PipeIcon key={5} />,
];

const AppStateMenubar = () => {
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const appStateContext = useAppVizStateContext();

    return (
        <Stack direction="row" spacing={2} className="toolbar">
            {icons.map((icon, index) => (
                <button
                    key={index}
                    className={`round-button ${activeButton === index ? 'active' : ''}`}
                    onClick={() => {
                        // Set the App-State based on the button clicked
                        // Remember: The Toolbar Icon Index starts ay 0, but AppState starts at 1
                        const newAppStateNumber = index + 1
                        if (newAppStateNumber === appStateContext.appVizState.vizState) {
                            appStateContext.dispatch(0)
                            setActiveButton(null);
                        } else {
                            // Set the new State 'On'
                            appStateContext.dispatch(newAppStateNumber)
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

export default AppStateMenubar;