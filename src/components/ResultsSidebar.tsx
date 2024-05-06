import "../styles/ResultsSidebar.css";
import { useState } from 'react';
import { Stack } from "@mui/material";
import ResultsView from "./ResultsView";
import { ResultType } from "../types/AirTableResultsRecord";

type ResultsItemProps = {
    displayName: string;
    results_type: ResultType;
    limit: number;
    current: number;
}

function ResultsItem(props: ResultsItemProps) {
    const { displayName, results_type, limit, current } = props
    const passing = current <= limit;
    const itemTypeName = passing ? "results-item results-item-pass" : "results-item results-item-fail";

    const [showResultsView, setShowResultsView] = useState(false);

    return (
        <>
            <button className={itemTypeName} onClick={() => setShowResultsView(true)}>
                <Stack direction="column" spacing={2} >
                    <p className="results-item-heading">{displayName}</p>
                    <p className="results-item-value">{current.toFixed(1)} / {limit.toFixed(1)}</p>
                </Stack>
            </button>

            {showResultsView && (<ResultsView
                setShowResultsView={setShowResultsView}
                results_type={results_type}
            />)}
        </>
    );
}


function ResultsSidebar() {
    return (
        <Stack direction="column" spacing={2} className="results-sidebar">
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Energy Demand:</h3>
                <ResultsItem displayName="Heating" results_type="HEATING_DEMAND" limit={15.0} current={14.3} />
                <ResultsItem displayName="Cooling" results_type="COOLING_DEMAND" limit={12.0} current={14.3} />
            </Stack>
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Peak Load:</h3>
                <ResultsItem displayName="Heating" results_type="PEAK_HEATING_LOAD" limit={10.0} current={6.4} />
                <ResultsItem displayName="Cooling" results_type="PEAK_COOLING_LOAD" limit={9.3} current={8.5} />
            </Stack>
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Total:</h3>
                <ResultsItem displayName="Site" results_type="SITE_ENERGY" limit={15.0} current={14.3} />
                <ResultsItem displayName="Primary" results_type="SOURCE_ENERGY" limit={15.0} current={14.3} />
                <ResultsItem displayName="CO2e" results_type="CO2E" limit={12.0} current={14.3} />
            </Stack>
        </Stack>
    );
}

export default ResultsSidebar;