import "../styles/ResultsView.css";
import { Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function ResultsView(props: { setShowResultsView: (value: boolean) => void }) {
    const { setShowResultsView } = props;
    return (
        <Paper className="results-view">
            <IconButton className="close-button" aria-label="close" onClick={() => setShowResultsView(false)}>
                <CloseIcon />
            </IconButton>
            <p>test</p>
        </Paper>
    )
}

export default ResultsView;