export type TExternalSourceFieldType = "string" | "number" | "date" | "boolean" | "date-concatenated-number" | "date-/" | "date-iso-8601";

export type IExternalSource = {
    name: string,
    url: string;
    root: string,
    fields: {
        name: string;
        type: TExternalSourceFieldType;
        description: string;
    }[],
    params: {
        name: string;
        type: TExternalSourceFieldType;
        description: string;
    }[],
}

export type TExternalSources = {[name: string]: IExternalSource}
