import { AirTableRecord } from "./AirTableRecord";

type ResultType = "HEATING_DEMAND" | "COOLING_DEMAND" | "PEAK_HEATING_LOAD" | "PEAK_COOLING_LOAD" | "SOURCE_ENERGY" | "SITE_ENERGY" | "CO2E";

type AirTableResultsField = {
    "DISPLAY_NAME": string;
    "TYPE": ResultType;
}

export type AirTableResultsRecord = AirTableRecord & {
    fields: AirTableResultsField;
}