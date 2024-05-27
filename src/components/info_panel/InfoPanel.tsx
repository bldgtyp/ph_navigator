import '../../styles/InfoPanel.css';
import { Paper } from "@mui/material";
import { SelectedObjectDetails } from './SelectedObjectDetails';
import { ToolStateIconBar } from './ToolStateIconBar';

function InfoPanel() {

    return (
        <Paper className="info-panel">
            <ToolStateIconBar />
            <SelectedObjectDetails />
        </Paper>
    );
}

export default InfoPanel;