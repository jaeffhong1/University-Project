/*
    Add Example Report
    This program will insert an example report into the database

    NOTE: ID's are manually set here, that is done purely for the sake of explicitly and reference while reading this file. In practice, ID's should always be allowed to automatically increment to prevent duplicates.
*/
SET @DiseaseCovidID = 68;
SET @SyndromeFluID = 4;
SET @SyndromeFeverID = 5;

-- EXAMPLE 1
SET @E1CaseEventDateID = 1;
SET @E1PublishEventDateID = 2;
SET @E1ArticleID = 1;
SET @E1ReportID = 1;


-- add a date
INSERT INTO EventDate (id, daydate, hour) VALUES (@E1CaseEventDateID, '2022-01-20', 13);
INSERT INTO EventDate (id, daydate, hour, minute) VALUES (@E1PublishEventDateID, '2022-01-21', 3, 22);

-- create the article & report
INSERT INTO Article (id, url, headline, eventdate_id) VALUES (@E1ArticleID, "http://disease_website.com/chicago-covid", "Covid Case in Chicago", @E1PublishEventDateID);
INSERT INTO Report (article_id, start_eventdate_id) VALUES (@E1ArticleID, @E1CaseEventDateID);

-- now we can create entries for many-to-many relationships
-- add a location
INSERT INTO ReportLocation (geonames_id, report_id) VALUES ('4443199', @E1ReportID); -- Rhodes Point Chicago

-- add a diseases and syndromes
INSERT INTO ReportDisease (disease_id, report_id) VALUES (@DiseaseCovidID , @E1ReportID); -- COVID-19
INSERT INTO ReportSyndrome (syndrome_id, report_id) VALUES (@SyndromeFluID, @E1ReportID); -- Influenza-like illness
INSERT INTO ReportSyndrome (syndrome_id, report_id) VALUES (@SyndromeFeverID, @E1ReportID); -- Acute fever and rash

