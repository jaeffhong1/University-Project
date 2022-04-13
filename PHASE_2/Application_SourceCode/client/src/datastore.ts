import App from "./App";

export class DataStore {
//export class DataStore {

    public static DataSourceDescription: Map<string, string> = new Map<string, string>([
        ["f0b5", "A description about f0b5."],
        ["IHeartTeams", "I Heart Teams"],
        ["1 group 2 group 3 group 4", "1 group 2 group 3 group 4 API"]
    ]);

    // I'm making this an array for now, but will iterface as though its a string
    selectedDataSources: string[];

    parent: App;

    // we can add these later
    //articles: TArticle[];
    //reports: TReport[];

    constructor(parent: App) {
        this.selectedDataSources = ["f0b5"];
        this.parent = parent;
    }

    updateParent(): void {
        this.parent.datastoreUpdate();
    }

    GetSelectedDataSource(): string {
        return this.selectedDataSources[0];
    }

    SetSelectedDataSource(dataSource: string): void {
        this.selectedDataSources[0] = dataSource;

        this.updateParent();
    }
}