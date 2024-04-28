import '../styles/Toolbar.css';
import { ReactComponent as RulerIcon } from '../icons/Ruler.svg';
import { ReactComponent as SurfaceIcon } from '../icons/Surface.svg';
import { ReactComponent as NoteIcon } from '../icons/Note.svg';
import { Stack } from "@mui/material";
import React, { useState } from 'react';

const icons = [<SurfaceIcon />, <RulerIcon />, <NoteIcon />];

interface ToolbarProps {
    appState: React.MutableRefObject<number | null>;
}

const Toolbar = (props: ToolbarProps) => {
    const { appState } = props;
    const [activeButton, setActiveButton] = useState<number | null>(null);

    return (
        <Stack direction="row" spacing={2} className="toolbar">
            {icons.map((icon, index) => (
                <button
                    key={index}
                    className={`round-button ${activeButton === index ? 'active' : ''}`}
                    onClick={() => {
                        appState.current = index;
                        setActiveButton(index);
                    }}
                >
                    {icon}
                </button>
            ))}
        </Stack>
    );
};

export default Toolbar;