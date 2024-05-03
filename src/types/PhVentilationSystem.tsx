import { PhDuctElement } from './PhDuctElement';

export type PhVentilationSystem = {
    supply_ducting: PhDuctElement[];
    exhaust_ducting: PhDuctElement[];
};