export type TExternalSourceFieldType = "string" | "number" | "date";

export interface IExternalSource {
    url: string;
    root: string | null;
    fields: {
        name: string;
        type: TExternalSourceFieldType;
        description: string;
    }[],
}

export type TExternalSources = {[name: string]: IExternalSource}