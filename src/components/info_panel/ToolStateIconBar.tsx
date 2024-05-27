import { useState } from 'react';
import { Stack } from "@mui/material";
import { ReactComponent as RulerIcon } from '../../icons/Ruler.svg';
import { ReactComponent as SurfaceIcon } from '../../icons/Surface.svg';
import { ReactComponent as NoteIcon } from '../../icons/Note.svg';
import { useAppToolStateContext } from '../../contexts/app_tool_state_context';

const icons = [
    <SurfaceIcon key={0} />,
    <RulerIcon key={1} />,
    <NoteIcon key={2} />,
];

export function ToolStateIconBar() {
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const appStateContext = useAppToolStateContext();

    return (
        <Stack direction="row" className="viz-state-icon-bar" spacing={1}>
            {icons.map((icon, index) => (
                <button
                    key={index}
                    className={`tool-button ${activeButton === index ? 'active' : ''}`}
                    onClick={() => {
                        // Set the App-State based on the button clicked
                        // Remember: The Toolbar Icon Index starts ay 0, but AppState starts at 1
                        const newAppStateNumber = index + 1;
                        if (newAppStateNumber === appStateContext.appToolState.toolState) {
                            appStateContext.dispatch(0);
                            setActiveButton(null);
                        } else {
                            // Set the new State 'On'
                            appStateContext.dispatch(newAppStateNumber);
                            setActiveButton(index);
                        }
                    }}
                >
                    {icon}
                </button>
            ))}
        </Stack>
    );
}
