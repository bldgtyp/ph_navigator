import "../styles/ResultsView.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import fetchData from "../hooks/fetchAirTable";
import { AirTableResultsRecord, ResultType } from "../types/AirTableResultsRecord";
import { generateDefaultRow } from "./DataGridFunctions";
import { TooltipWithInfo } from "./TooltipWithInfo";
import CertificationResultsGraph from "../graphs/CertificationResultsGraph";

type ResultsViewProps = {
    setShowResultsView: (value: boolean) => void;
    results_type: ResultType;
}

type DataGridRow = {
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
        flex: 1,
        renderCell: (params: any) => TooltipWithInfo(params),
    },
    {
        key: "unit",
        field: "units",
        headerName: "Unit",
        flex: 1,
    },
    {
        key: "type",
        field: "type",
        headerName: "Type",
        flex: 1,
    },
];

// Create the columns object based on tableFields and then
// create an Array with a default single row, with all '-' cells.
// This will display while the data is being fetched
const defaultRow = generateDefaultRow(tableFields);

// ----------------------------------------------------------------------------
/**
 * Creates row data array for the CertificationResultsDataGrid component.
 * @param data An array of CertResultFields objects from AirTable.
 * @returns An array of row data objects.
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

function ResultsView(props: ResultsViewProps) {
    const { setShowResultsView, results_type } = props;
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

            // ----------------------------------------------------------------------
            // Set the row state
            newRowData.length > 0 ? setRowData(newRowData) : setRowData(defaultRow);

            // ----------------------------------------------------------------------
            // Set the 'Limits' for each of the graphs
            // setSourceEnergyLimits(createAnnualEnergyLimits(sourceEnergyData));

        });
    }, [results_type, projectId]);

    return (
        <Paper className="results-view">
            <IconButton className="close-button" aria-label="close" onClick={() => setShowResultsView(false)}>
                <CloseIcon />
            </IconButton>
            <p>{results_type}</p>
            <CertificationResultsGraph
                title="Source Energy [kWh/a]"
                plotData={rowData}
                variant="energy"
            />
        </Paper>
    )
}

export default ResultsView;