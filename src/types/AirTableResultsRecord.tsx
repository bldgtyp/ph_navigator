import { AirTableRecord } from "./AirTableRecord";

export type ResultType = "HEATING_DEMAND" | "COOLING_DEMAND" | "PEAK_HEATING_LOAD" | "PEAK_COOLING_LOAD" | "SOURCE_ENERGY" | "SITE_ENERGY" | "CO2E";

export type AirTableResultsField = {
    "DISPLAY_NAME": string;
    "TYPE": ResultType;
    "GAIN_LOSS": string;
    "UNIT": string;
    [key: string]: any; // arbitrary number of dated result / target fields
}

export type AirTableResultsRecord = AirTableRecord & {
    fields: AirTableResultsField;
}