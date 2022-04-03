import * as data_source from "../Application_SourceCode/allData.js";
export class ApiAdaptor {
    constructor() {
    }
    async getReport(website, start_date, end_date, key_terms, location) {
        let data_obj = "";
        switch (website) {
            case "cidrap":
                data_obj = new data_source.dataCidrap();
                break;
            case "who":
                data_obj = new data_source.dataWho();
                break;
            case "global":
                data_obj = new data_source.dataGlobal();
                break;
        }
        let data = await data_obj.getReport(start_date, end_date, key_terms, location); 
        return data;
    }
}
