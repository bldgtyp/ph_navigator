import { PhHvacPipeBranch } from './PhHvacPipeBranch';
import { PhHvacPipeElement } from './PhHvacPipeElement';

export type PhHvacPipeTrunk = {
    identifier: string;
    display_name: string;
    pipe_element: PhHvacPipeElement;
    branches: { [key: string]: PhHvacPipeBranch };
    multiplier: number;
    user_data: Object;
}