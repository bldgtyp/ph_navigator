import "../styles/ResultsSidebar.css";
import { useState } from 'react';
import { Stack } from "@mui/material";
import ResultsView from "./ResultsView";
import { ResultType } from "../types/AirTableResultsRecord";
import { HeatingDemandSeries } from "../graphs/HeatingDemand";
import { CoolingDemandSeries } from "../graphs/CoolingDemand";

type ResultsItemProps = {
    buttonTitle: string;
    graphTitle: string;
    results_type: ResultType;
    limit: number;
    current: number;
    graphSeries: any[];
}

function ResultsItem(props: ResultsItemProps) {
    const { buttonTitle: displayName, graphTitle, results_type, limit, current, graphSeries } = props
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
                resultsType={results_type}
                graphTitle={graphTitle}
                graphSeries={graphSeries}
            />)}
        </>
    );
}


function ResultsSidebar() {
    return (
        <Stack direction="column" spacing={2} className="results-sidebar">
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Energy Demand:</h3>
                <ResultsItem
                    buttonTitle="Heating"
                    graphTitle="Heating Energy Demand"
                    results_type="HEATING_DEMAND"
                    limit={15.0}
                    current={14.3}
                    graphSeries={HeatingDemandSeries}
                />
                <ResultsItem
                    buttonTitle="Cooling"
                    graphTitle="Cooling Energy Demand"
                    results_type="COOLING_DEMAND"
                    limit={12.0}
                    current={14.3}
                    graphSeries={CoolingDemandSeries}
                />
            </Stack>
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Peak Load:</h3>
                <ResultsItem
                    buttonTitle="Heating"
                    graphTitle="Peak Heating Load"
                    results_type="PEAK_HEATING_LOAD"
                    limit={10.0}
                    current={6.4}
                    graphSeries={HeatingDemandSeries}
                />
                <ResultsItem
                    buttonTitle="Cooling"
                    graphTitle="Peak Cooling Load"
                    results_type="PEAK_COOLING_LOAD"
                    limit={9.3}
                    current={8.5}
                    graphSeries={HeatingDemandSeries}
                />
            </Stack>
            <Stack direction="column" spacing={1}>
                <h3 className="results-section-heading">Total:</h3>
                <ResultsItem
                    buttonTitle="Site"
                    graphTitle="Annual Site Energy"
                    results_type="SITE_ENERGY"
                    limit={15.0}
                    current={14.3}
                    graphSeries={HeatingDemandSeries}
                />
                <ResultsItem
                    buttonTitle="Primary"
                    graphTitle="Annual Primary (Source) Energy"
                    results_type="SOURCE_ENERGY"
                    limit={15.0}
                    current={14.3}
                    graphSeries={HeatingDemandSeries}
                />
                <ResultsItem
                    buttonTitle="CO2e"
                    graphTitle="Annual CO2e Emissions"
                    results_type="CO2E"
                    limit={12.0}
                    current={14.3}
                    graphSeries={HeatingDemandSeries}
                />
            </Stack>
        </Stack>
    );
}

export default ResultsSidebar;