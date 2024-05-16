import { Project } from './Project'

export type Team = {
    display_name: string,
    identifier: string,
    projects_storage: Project[],
}