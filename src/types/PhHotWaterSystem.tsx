import { PhHvacPipeTrunk } from "./PhHvacPipeTrunk";

export type PhHotWaterSystem = {
    distribution_piping: { [key: string]: PhHvacPipeTrunk };
};