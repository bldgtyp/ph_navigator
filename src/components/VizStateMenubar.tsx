// Menu Bar for setting the App State and Visibility

import '../styles/VizStateMenuBar.css';
import { useState } from 'react';
import { Stack, Tooltip } from "@mui/material";
import { ReactComponent as FloorSegmentIcon } from '../icons/FloorSegments.svg';
import { ReactComponent as DuctIcon } from '../icons/Ducts.svg';
import { ReactComponent as PipeIcon } from '../icons/Piping.svg';
import { ReactComponent as SpaceIcon } from '../icons/Space.svg';
import { ReactComponent as SunPathIcon } from '../icons/SunPath.svg';
import { useAppVizStateContext } from '../contexts/app_viz_state_context';

const icons: any[] = [
    <FloorSegmentIcon key={1} title="Interior Floors" />,
    <SpaceIcon key={2} title="Interior Spaces" />,
    <SunPathIcon key={3} title="Sunpath" />,
    <DuctIcon key={4} title="Ventilation Ducting" />,
    <PipeIcon key={5} title="Hot Water Piping" />,
];

const AppStateMenubar = () => {
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const appStateContext = useAppVizStateContext();

    return (
        <Stack direction="row" spacing={2} className="toolbar">
            {icons.map((icon, index) => (
                <Tooltip title={icon.title} key={index} placement='top'>
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
                </Tooltip>
            ))}
        </Stack>
    );
};

export default AppStateMenubar;