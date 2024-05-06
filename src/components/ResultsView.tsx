import "../styles/ResultsView.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import fetchData from "../hooks/fetchAirTable";
import { AirTableResultsRecord } from "../types/AirTableResultsRecord";

type ResultsViewProps = {
    setShowResultsView: (value: boolean) => void;
    results_type: "HEATING_DEMAND" | "COOLING_DEMAND" | "PEAK_HEATING_LOAD" | "PEAK_COOLING_LOAD" | "SOURCE_ENERGY" | "SITE_ENERGY" | "CO2E";
}

function ResultsView(props: ResultsViewProps) {
    const { setShowResultsView, results_type } = props;
    const { projectId } = useParams();

    useEffect(() => {
        console.log("ResultsView mounted", results_type);
        fetchData<AirTableResultsRecord>(`${projectId}/cert_results/${results_type}`).then(data => {
            data.filter(record => record.fields["TYPE"] === results_type).forEach(record => {
                console.log(record.fields["TYPE"], record.fields["DISPLAY_NAME"]);
            });
        });
    }, [results_type, projectId]);

    return (
        <Paper className="results-view">
            <IconButton className="close-button" aria-label="close" onClick={() => setShowResultsView(false)}>
                <CloseIcon />
            </IconButton>
            <p>{results_type}</p>
        </Paper>
    )
}

export default ResultsView;