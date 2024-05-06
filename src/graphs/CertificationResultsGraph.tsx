import { Stack } from "@mui/material";
import { GraphAnnualDemand } from "./EnergyDemandGraph";
import { DataGridRow } from "../components/ResultsView";

export type GraphProps = {
  key: string;
  id: string;
  display_name: string;
  type: string;
  [key: string]: any;
};

const chartSettings = {
  margin: { top: 30, bottom: 50, left: 70, right: 50 },
  tooltip: { trigger: "item" },
  sx: {
    "& .MuiChartsLegend-series text": { fontSize: "0.7em !important" },
    "& .MuiChartsAxis-tickLabel": { fontSize: "0.6em !important" },
    "& .MuiBarElement-root": {
      stroke: "#fff",
      strokeWidth: "1",
    },
  },
  slotProps: {
    legend: {
      direction: "row",
      position: { vertical: "bottom", horizontal: "middle" },
      padding: 0,
      itemMarkWidth: 15,
      itemMarkHeight: 10,
      markGap: 3,
      itemGap: 1,
    },
  },
  xAxis: [{ id: "xAxisBand", scaleType: "band", dataKey: "plot", categoryGapRatio: 0.3, barGapRatio: 0.1 }],
  yAxis: [{ id: "yAxisLinear", scaleType: "linear" }],
  leftAxis: {
    axisId: "yAxisLinear",
    disableTicks: true,
  },
  bottomAxis: {
    axisId: "xAxisBand",
    disableTicks: true,
  },
};

function CertificationResultsGraph(props: {
  plotData: DataGridRow[];
}) {

  return (
    <>
      <Stack direction="column" sx={{ width: "100%", height: "90%" }}>
        <GraphAnnualDemand data={props.plotData} chartSettings={chartSettings} />
      </Stack>
    </>
  );
}

export default CertificationResultsGraph;
