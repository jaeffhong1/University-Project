import App from "./App";

export default class DataStore {

    public static DataSourceDescription: Map<string, string> = new Map<string, string>([
        ["f0b5", "A description about f0b5."],
        ["Epiwatch", "A description about EPIWATCH."],
        //["IHeartTeams", "I Heart Teams"],
        //["1 group 2 group 3 group 4", "1 group 2 group 3 group 4 API"]
    ]);

    // I'm making this an array for now, but will iterface as though its a string
    private selectedDataSources: string[];
    private startTime: string;
    private endTime: string;

    private parent: App;

    // we can add these later:
    //articles: TArticle[];
    //reports: TReport[];

    constructor(parent: App) {
        // help calculate today's date
        const today = new Date();

        this.selectedDataSources = ["Epiwatch"];
        this.startTime = "2020-01-01T00:00:00";
        this.endTime = `${today.getUTCFullYear()}-${String(today.getUTCMonth()).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}T00:00:00`;

        // store the owner of the datastore so we can tell it to update
        this.parent = parent;
    }

    // send a message to "parent" to update itself if data in the datastore changes
    private updateParent(): void {
        console.log("UPDATING DATASTORE");
        this.parent.datastoreUpdate();
    }

    public GetDataSource(): string {
        return this.selectedDataSources[0];
    }

    public SetDataSource(dataSource: string): void {
        console.log("CAHNGING DATASOUIRCE FROM: ", this.selectedDataSources[0], " TO ", dataSource);
        this.selectedDataSources[0] = dataSource;

        

        // we should update the parent
        this.updateParent();
    }

    private timeFromDatePicker(date: string): string {
        return date.replace(" ", "T");
    }

    public GetStartTime(): string {
        return this.startTime;
    }

    public SetStartTime(startTime: string): void {
        this.startTime = this.timeFromDatePicker(startTime);
        this.updateParent();
    }

    public GetEndTime(): string {
        return this.endTime;
    }

    public SetEndTime(endTime: string): void {
        this.endTime = this.timeFromDatePicker(endTime);
        this.updateParent();
    }
}