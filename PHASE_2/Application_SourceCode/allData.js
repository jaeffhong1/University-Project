import fetch from "node-fetch";
export class dataCidrap {
    constructor() {
        this.api_source = "http://seng3011.duckdns.org/";
    }

    async getReport(start_date, end_date, key_terms, location) {
        let data_url = this.api_source + "article/filter?start_date=" + (start_date) + "\&end_date=" + (end_date) + "\&key_terms=" + (key_terms) + "\&location=" + (location); 
        const response = await fetch(data_url);
        return response.json();
    }
}
    
export class dataGlobal {
    constructor() {
        this.api_source = "https://iheartteams.ts.r.appspot.com/";
    }

    async getReport(start_date, end_date, key_terms, location) {
        let data_url = this.api_source + "articles/?start_date=" + (start_date) + "\&end_date=" + (end_date) + "\&key_terms=" + (key_terms) + "\&location=" + (location); 
        const response = await fetch(data_url);
        return response.json();
    }
}

export class dataWho {
    constructor() {
        this.api_source = "http://epidemicscraper-env.eba-t2stx6uv.us-east-1.elasticbeanstalk.com/";
    }

    async getReport(start_date, end_date, key_terms, location) {
        let data_url = this.api_source + "search?start_date=" + (start_date) + "\&end_date=" + (end_date) + "\&key_terms=" + (key_terms) + "\&location=" + (location); 
        const response = await fetch(data_url);
        return response.json();
    }
}
    