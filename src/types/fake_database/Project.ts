import { ModelView } from './ModelView'

export type Project = {
    display_name: string,
    identifier: string,
    model_storage: ModelView[],
}