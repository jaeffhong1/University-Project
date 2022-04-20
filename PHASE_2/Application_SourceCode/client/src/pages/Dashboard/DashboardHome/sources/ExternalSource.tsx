export type TExternalSourceFieldType = "string" | "number" | "date" | "boolean" | "date-concatenated-number";

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
