import { BarChart } from "@mui/x-charts/BarChart";

export type GraphProps = {
  key: string;
  id: string;
  display_name: string;
  type: string;
  [key: string]: any;
};

/**
 * Prepares the data for plotting by re-shaping it based on the dated 'RESULT' elements.
 *
 * @param data The original data array.
 * @returns The re-shaped data organized by the dated 'RESULT' elements.
 */
export function prepareDataForPlot(data: GraphProps[]) {

  // Get all the dated results keys
  const datedResultsKeys = Object.keys(data[0]).filter((key) => key.includes("RESULT"));

  // Order datedResultsKeys by number / alphabetically
  datedResultsKeys.sort((a, b) => {
    const aNum = parseInt(a.split("_")[0]);
    const bNum = parseInt(b.split("_")[0]);
    if (aNum < bNum) return -1;
    if (aNum > bNum) return 1;
    return 0;
  });

  // ------------------------------------------------------------------------------------
  // re-shape the data so that it is organized by the dated 'RESULT' elements >>
  // data = [
  //  { key: "1", id: "1", display_name: "heating_demand", type: "SITE_ENERGY", xxx_RESULT: 20, yyy_RESULT: 30, },
  //  { key: "2", id: "2", display_name: "cooling_demand", type: "SITE_ENERGY", xxx_RESULT: 30, yyy_RESULT: 40, },
  //  ...
  // ]
  // becomes >>
  // dataByDatedResult = [
  //  { plot: "xxx_RESULT", HEAT_DEMAND: 10, TRANSMISSION LOSS: 20, SOLAR GAIN: 20, ... },
  //  { plot: "yyy_RESULT", HEAT_DEMAND: 10, TRANSMISSION LOSS: 20, SOLAR GAIN: 20, ... },
  //  { plot: "zzz_RESULT", HEAT_DEMAND: 10, TRANSMISSION LOSS: 20, SOLAR GAIN: 20, ... },
  //  ...
  // ]
  const dataByDatedResult = datedResultsKeys.map((key) => {
    const newItem: any = {};
    const [date] = key.split("_"); // Fix the X-Axis...
    newItem["plot"] = date;
    data.forEach((item) => { newItem[item.display_name] = item[key] });
    return newItem;
  });

  return dataByDatedResult;
}

export function BarGraph(graphProps: {
  data: any[];
  chartSettings: any;
  graphSeries: any[];
}) {
  if (graphProps.data.length < 3) {
    return <div>No Data.</div>;
  }

  const dataByDatedResult = prepareDataForPlot(graphProps.data);

  return (
    <BarChart
      dataset={dataByDatedResult}
      series={graphProps.graphSeries}
      {...graphProps.chartSettings}
      yAxis={[{ ...graphProps.chartSettings.yAxis[0], max: 30000 }]}
    >
    </BarChart>
  );
}
