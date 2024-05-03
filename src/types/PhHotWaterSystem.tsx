import { PhHvacPipeTrunk } from "./PhHvacPipeTrunk";
import { PhHvacPipeElement } from "./PhHvacPipeElement";

export type PhHotWaterSystem = {
    distribution_piping: { [key: string]: PhHvacPipeTrunk };
    recirc_piping: { [key: string]: PhHvacPipeElement };
};