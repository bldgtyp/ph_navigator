import { PhHvacPipeElement } from './PhHvacPipeElement';

export type PhHvacPipeBranch = {
    identifier: string;
    display_name: string;
    pipe_element: PhHvacPipeElement;
    fixtures: { [key: string]: PhHvacPipeElement };
    user_data: Object;
}