import { appColors } from "../styles/AppColors";

export const CoolingDemandSeries = [
    // -- Losses -- 
    {
        dataKey: "COOLING DEMAND [SENSIBLE]",
        label: "Cooling Demand (Sensible)",
        stack: "A",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.COOLING_1,
    },
    {
        dataKey: "COOLING DEMAND [LATENT]",
        label: "Cooling Demand (Latent)",
        stack: "A",
        highlightScope: {
            highlighted: "series",
            faded: "global",
        },
        color: appColors.COOLING_1,
    },
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
    // -- Gains ---
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