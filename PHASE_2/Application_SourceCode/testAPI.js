import {ApiAdaptor} from "../Application_SourceCode/ApiAdaptor.js";
import {Hierarchy} from "../Application_SourceCode/Hierarchy.js";

//http://seng3011.duckdns.org/article/filter?start_date=2021-10-01T00:00:00&end_date=2021-12-01T00:00:00&key_terms=covid&location=China
let start_date = "2019-11-30T00:00:00";
let end_date = "2021-12-01T00:00:00";
let key_terms = "Covid-19";
let location = "China";
var apiAdaptor = new ApiAdaptor();
//apiAdaptor.getReport("global", start_date, end_date, key_terms, location).then(data => {console.log(data)});

var hierarchy = new Hierarchy();
hierarchy.getReport(start_date, end_date, key_terms, location).then(data => {console.log(data)});