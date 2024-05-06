import "../styles/ResultsSidebar.css";
import { useState } from 'react';
import { Stack } from "@mui/material";
import ResultsView from "./ResultsView";


function ResultsItem(props: { id: string, limit: number, current: number }) {
    const { id, limit, current } = props
    const passing = current <= limit;
    const itemTypeName = passing ? "results-item results-item-pass" : "results-item results-item-fail";

    const [showResultsView, setShowResultsView] = useState(false);

    return (
        <>
            <button className={itemTypeName} onClick={() => setShowResultsView(true)}>
                <Stack direction="column" spacing={2} >
                    <p className="results-item-heading">{id}</p>
                    <p className="results-item-value">{current.toFixed(1)} / {limit.toFixed(1)}</p>
                </Stack>
            </button>

            {showResultsView && (<ResultsView setShowResultsView={setShowResultsView} />)}
        </>
    );
}


function ResultsSidebar() {
    return (
        <Stack direction="column" spacing={2} className="results-sidebar">
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Energy Demand:</h3>
                <ResultsItem id="Heating" limit={15.0} current={14.3} />
                <ResultsItem id="Cooling" limit={12.0} current={14.3} />
            </Stack>
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Peak Load:</h3>
                <ResultsItem id="Heating" limit={10.0} current={6.4} />
                <ResultsItem id="Cooling" limit={9.3} current={8.5} />
            </Stack>
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Total:</h3>
                <ResultsItem id="Site" limit={15.0} current={14.3} />
                <ResultsItem id="Primary" limit={15.0} current={14.3} />
                <ResultsItem id="CO2e" limit={12.0} current={14.3} />
            </Stack>
        </Stack>
    );
}

export default ResultsSidebar;