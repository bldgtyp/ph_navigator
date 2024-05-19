
type ProjectListingRecordFields = {
    PROJECT_NUMBER: string;
    PROJECT_NAME: string;
    APP_ID: string; // The Airtable App-ID for the specified project
    TABLE_ID: string; // The Airtable Table-ID for the specified project
}

type ProjectListingRecord = {
    id: string;
    createdTime: string;
    fields: ProjectListingRecordFields;
}

export type ProjectListingTable = {
    records: ProjectListingRecord[];
}