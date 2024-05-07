// The base record. Assumed to be extended with specific 'fields' types.

export type AirTableRecord = {
    id: string;
    createdTime: string;
    fields: Object;
}