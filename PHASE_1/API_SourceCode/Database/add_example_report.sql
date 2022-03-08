/*
    Add Example Report
    This program will insert an example report into the database

    NOTE: ID's are manually set here, that is done purely for the sake of explicitly and reference while reading this file. In practice, ID's should always be allowed to automatically increment to prevent duplicates.

    TODO:
        - Replace report and article id (0) with alias.

*/

-- add a date
-- Report Start
INSERT INTO EventDate (id, event_date, hour) VALUES (0, '2022-01-20', 13); -- we only know up to the hour
-- Article publishes
INSERT INTO EventDate (id, event_date, hour) VALUES (1, '2022-01-21', 3, 22);

-- create the article & report
INSERT INTO Article (id, url, headline, eventdate_id) VALUES (0, "http://disease_website.com", "Covid Case in Chicago", 1);
INSERT INTO Report (article_id, eventdate_start_id) VALUES (0, 0);

-- now we can create entries for many-to-many relationships
-- add a location
INSERT INTO ReportLocation (geonames_id, report_id) VALUES ('4443199', 0); -- Rhodes Point Chicago

-- add a disease
INSERT INTO ReportDisease (disease_id, report_id) VALUES (68, 0); -- COVID-19

-- add syndromes
INSERT INTO ReportSyndrome (syndrome_id, report_id) VALUES (4, 0); -- Influenza-like illness
INSERT INTO ReportSyndrome (syndrome_id, report_id) VALUES (5, 0); -- Acute fever and rash

