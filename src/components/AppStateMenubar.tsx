import '../styles/Toolbar.css';
import { useState, useContext } from 'react';
import { Stack } from "@mui/material";
import { ReactComponent as RulerIcon } from '../icons/Ruler.svg';
import { ReactComponent as SurfaceIcon } from '../icons/Surface.svg';
import { ReactComponent as NoteIcon } from '../icons/Note.svg';
import { ReactComponent as DuctIcon } from '../icons/Ducts.svg';
import { ReactComponent as PipeIcon } from '../icons/Piping.svg';
import { ReactComponent as SpaceIcon } from '../icons/Space.svg';
import { ReactComponent as SunPathIcon } from '../icons/SunPath.svg';
import { AppStateContext } from '../App';

const icons = [<SurfaceIcon />, <RulerIcon />, <NoteIcon />, <SpaceIcon />, <SunPathIcon />, <DuctIcon />, <PipeIcon />];

const AppStateMenubar = () => {
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const appStateContext = useContext(AppStateContext)

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
                        if (newAppStateNumber === appStateContext.appState.state) {
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