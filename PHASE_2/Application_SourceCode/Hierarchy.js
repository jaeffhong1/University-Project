import fetch from "node-fetch";
export class Hierarchy {
    constructor() {
        this.api_source = "http://seng3011.duckdns.org/";
        //this.api_source = "http://localhost:36042";
    }
    async getReport(start_date, end_date, key_terms, location) {
        let data_url = this.api_source + "/report/filter/internal?start_date=" + (start_date) + "\&end_date=" + (end_date) + "\&key_terms=" + (key_terms) + "\&location=" + (location); 
        const response = await fetch(data_url);
        return response.json();
    }
}

