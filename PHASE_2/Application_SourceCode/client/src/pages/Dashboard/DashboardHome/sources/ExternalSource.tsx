export type TExternalSourceFieldType = "string" | "number" | "date";

export interface IExternalSource {
    name: string,
    url: string;
    root: string,
    fields: {
        name: string;
        type: TExternalSourceFieldType;
        description: string;
    }[],
}

export type TExternalSources = {[name: string]: IExternalSource}