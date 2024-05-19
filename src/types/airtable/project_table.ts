
type HbJsonFILE = {
    filename: string;
    id: string;
    size: number;
    type: string;
    url: string;
}

type ProjectRecordFields = {
    DISPLAY_NAME: string;
    HBJSON_FILE: HbJsonFILE[];
    DATE: string;
}

type ProjectRecord = {
    id: string;
    createdTime: string;
    fields: ProjectRecordFields;
}

export type ProjectTable = {
    records: ProjectRecord[];
}