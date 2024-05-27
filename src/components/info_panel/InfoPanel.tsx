import '../../styles/InfoPanel.css';
import { useState } from 'react';
import { Paper, Button } from "@mui/material";
import { UValueSliders } from './UValueSliders';
import { SelectedObjectDetails } from './SelectedObjectDetails';
import { ToolStateIconBar } from './ToolStateIconBar';

function InfoPanel() {
    const [selectedPanel, setSelectedPanel] = useState('face-data');
    return (
        <Paper className="info-panel">
            <ToolStateIconBar />
            <Button
                className={`panel-select-button ${selectedPanel === 'face-data' ? 'button-selected' : ''}`}
                onClick={() => setSelectedPanel('face-data')}>
                Item Data
            </Button>
            <Button
                className={`panel-select-button ${selectedPanel === 'u-values' ? 'button-selected' : ''}`}
                onClick={() => setSelectedPanel('u-values')}>
                U-Values
            </Button>
            {selectedPanel === 'face-data' ? <SelectedObjectDetails /> : <UValueSliders />}
        </Paper>
    );
}

export default InfoPanel;