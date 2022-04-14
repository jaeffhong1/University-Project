export type TExternalSourceFieldType = "string" | "number" | "Date";

export interface IExternalSource {
    url: string;
    root: string,
    fields: {
        fieldName: string;
        type: string;
        description: string;
    }[],
}