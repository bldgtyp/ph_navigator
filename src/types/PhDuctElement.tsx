import { PhDuctSegment } from './PhDuctSegment';

export type PhDuctElement = {
    display_name: string;
    duct_type: number;
    segments: { [key: string]: PhDuctSegment };
}