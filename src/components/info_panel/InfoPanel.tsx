import '../../styles/InfoPanel.css';
import { Paper } from "@mui/material";
import { SelectedObjectDetails } from './SelectedObjectDetails';

function InfoPanel() {

    return (
        <Paper className="info-panel">
            <SelectedObjectDetails />
        </Paper>
    );
}

export default InfoPanel;