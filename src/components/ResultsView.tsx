import "../styles/ResultsView.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, IconButton, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import fetchData from "../hooks/fetchAirTable";
import { AirTableResultsRecord, ResultType } from "../types/AirTableResultsRecord";
import { generateDefaultRow } from "./DataGridFunctions";
import { BarGraph } from "../graphs/BarGraph";
import { barChartSettings } from "../styles/BarCharts";

export type DataGridRow = {
    key: string;
    id: string;
    display_name: string;
    unit: string;
    gainOrLoss: string;
    [key: string]: any;
};

// ----------------------------------------------------------------------------
// Define the starting Columns and Default Row
const tableFields = [
    {
        key: "display_name",
        field: "Name",
        headerName: "ID",
    },
    {
        key: "unit",
        field: "units",
        headerName: "Unit",
    },
    {
        key: "type",
        field: "type",
        headerName: "Type",
    },
];

// Create the columns object based on tableFields and then
// create an Array with a default single row, with all '-' cells.
// This will display while the data is being fetched
const defaultRow = generateDefaultRow(tableFields);

// ----------------------------------------------------------------------------
/**
 * Creates row-data array for the CertificationResultsDataGrid component.
 * @param data An array of AirTableResultsRecord objects from AirTable.
 * @returns An array of DataGridRow objects.
 */
function createRowDataArray(data: AirTableResultsRecord[]) {
    return data.map((item: AirTableResultsRecord) => {
        const newRow: DataGridRow = {
            key: item.id,
            id: item.id,
            display_name: item.fields.DISPLAY_NAME,
            unit: item.fields.UNIT,
            type: item.fields.TYPE,
            gainOrLoss: item.fields.GAIN_LOSS,
        };

        // Add in the dated 'result' fields, if any
        for (const [key, value] of Object.entries(item.fields)) {
            if (key.includes("RESULT")) {
                newRow[key] = value;
            }
        }
        return newRow;
    });
}


// ----------------------------------------------------------------------------
type ResultsViewProps = {
    setShowResultsView: (value: boolean) => void;
    resultsType: ResultType;
    graphTitle: string;
    graphSeries: any[];
}

function ResultsView(props: ResultsViewProps) {
    const { setShowResultsView, resultsType: results_type, graphTitle, graphSeries } = props;
    const { projectId } = useParams();
    const [rowData, setRowData] = useState<Array<DataGridRow>>(defaultRow);

    useEffect(() => {
        fetchData<AirTableResultsRecord>(`${projectId}/cert_results/${results_type}`).then(data => {
            const filteredData = data.filter(
                (record) => record.fields.TYPE === results_type
            );

            // ----------------------------------------------------------------
            // Build all of the new Rows
            const newRowData: DataGridRow[] = createRowDataArray(filteredData);

            // ----------------------------------------------------------------
            // Set the row state
            newRowData.length > 0 ? setRowData(newRowData) : setRowData(defaultRow);

            // ----------------------------------------------------------------
            // Set the 'Limits' for each of the graphs
            // setSourceEnergyLimits(createAnnualEnergyLimits(sourceEnergyData));

        });
    }, [results_type, projectId]);

    return (
        <Paper className="results-view">
            <Stack className="results-view-titlebar" direction="row" justifyContent="space-between">
                <p className="results-view-title">{graphTitle}</p>
                <IconButton className="close-button" aria-label="close" onClick={() => setShowResultsView(false)}>
                    <CloseIcon />
                </IconButton>
            </Stack>
            <Stack sx={{ width: "100%", height: "90%" }}>
                <BarGraph
                    data={rowData}
                    chartSettings={barChartSettings}
                    graphSeries={graphSeries}
                />
            </Stack>
        </Paper>
    )
}

export default ResultsView;