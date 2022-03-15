/*
    Add Example Report
    This program will insert an example report into the database

    NOTE: ID's are manually set here, that is done purely for the sake of explicitly and reference while reading this file. In practice, ID's should always be allowed to automatically increment to prevent duplicates.
*/

-- EXAMPLE 2
SET @DAnthraxInhale = 5;
SET @DCovidID = 68;  -- COVID-19
SET @SFluID = 4; -- Acute influenza
SET @SFeverID = 5; -- Acute fever and rash
SET @SRespiratoryID = 4; -- acute Respiratory syndrome

SET @E2CaseEventDateID = 3;
SET @E2ArticleID = 1;
SET @E2ReportID = 2;

-- add another report to the same article
INSERT INTO EventDate (id, daydate, hour, minute) VALUES (@E2CaseEventDateID, '2022-01-20', 13, 12); -- 1:12
INSERT INTO Report (id, article_id, start_eventdate_id) VALUES (@E2ReportID, @E2ArticleID, @E2CaseEventDateID);
INSERT INTO ReportLocation (geonames_id, report_id) VALUES ('4443199', @E2ReportID); -- Rhodes Point Chicago
INSERT INTO ReportDisease (disease_id, report_id) VALUES (@DCovidID , @E2ReportID);
INSERT INTO ReportSyndrome (syndrome_id, report_id) VALUES (@SRespiratoryID, @E2ReportID);

-- EXAMPLE 3
SET @E3ArticleEventDateID = 4;
SET @E3ArticleID = 2;
SET @E3ReportEventDateID = 5;
SET @E3ReportID = 3;

-- create the article & report
INSERT INTO EventDate (id, daydate, hour, minute) VALUES (@E3ArticleEventDateID, '2021-09-02', 10, 45); -- 10:45
INSERT INTO Article (id, url, headline, eventdate_id) VALUES (@E3ArticleID, "http://disease_website.com/anthrax", "Anthrax Inhalation Case", @E3ArticleEventDateID);
INSERT INTO EventDate (id, daydate, hour, minute) VALUES (@E3ReportEventDateID, '2021-09-1', 15, 30); -- 1:12
INSERT INTO Report (id, article_id, start_eventdate_id) VALUES (@E3ReportID, @E3ArticleID, @E3ReportEventDateID);
INSERT INTO ReportLocation (geonames_id, report_id) VALUES ('4443199', @E3ReportID); -- Rhodes Point Chicago
INSERT INTO ReportDisease (disease_id, report_id) VALUES (@DAnthraxInhale , @E3ReportID);
-- no syndromes

