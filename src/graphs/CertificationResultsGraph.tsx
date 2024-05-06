import { Stack } from "@mui/material";
import { GraphAnnualDemand } from "./EnergyDemandGraph";

export type GraphProps = {
  key: string;
  id: string;
  display_name: string;
  type: string;
  [key: string]: any;
};

const chartSettings = {
  colors: [
    "#CB6D69", // Heating
    "#82B2D9", // Cooling
    "#d3d19d", // Green 1
    "#a3c087", // Green 2
    "#6ab07d", // Green 3
    "#529c66", // Green 4
    "#3b824e", // Green 5
  ],
  height: 350,
  margin: { top: 5, bottom: 70, left: 70, right: 15 },
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
  title: string;
  variant: "energy" | "demand" | "load";
  plotData: any[];
}) {

  return (
    <>
      <Stack direction="column" sx={{ width: "100%" }}>
        <GraphAnnualDemand data={props.plotData} chartSettings={chartSettings} />
      </Stack>
    </>
  );
}

export default CertificationResultsGraph;
