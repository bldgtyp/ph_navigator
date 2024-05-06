import { appColors } from "../styles/AppColors";

export const HeatingDemandSeries = [
    {
        dataKey: "TRANSMISSION LOSS",
        label: "Transmission Loss",
        stack: "A",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.COOLING_2,
    },
    {
        dataKey: "VENTILATION LOSS",
        label: "Ventilation Loss",
        stack: "A",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.COOLING_3,
    },
    {
        dataKey: "HEAT DEMAND",
        label: "Heating Demand",
        stack: "B",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.HEATING_1,
    },
    {
        dataKey: "INTERNAL GAIN",
        label: "Internal Gain",
        stack: "B",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.HEATING_3,
    },
    {
        dataKey: "SOLAR GAIN",
        label: "Solar Gain",
        stack: "B",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.HEATING_4,
    },
]