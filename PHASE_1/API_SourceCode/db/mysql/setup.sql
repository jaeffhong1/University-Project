/*
    SQL Database Build/Setup
    WARNING: Running this will delete all database data
    This will create the required tables with the correct structure for initialising the database.
    
    Tables:
        - Disease           (id[PK], name)
        - Syndrome          (id[PK], name)
        - ReportDisease     (id[PK], disease_id[FK], report_id[FK])
        - ReportSyndrome
        - ReportLocation    (id[PK], geonames_id, report_id[FK])
        - EventDate         (id[PK], daydate, hour, minute)
        - Article           (id[PK], url, headline, edate[FK])
        - Report            (id[PK], article_id[FK], eventdate_start_id[FK], eventdate_finish_id[FK])

    Todo:
        - Add report procedure
        - Read report (with all data) proc
        - ViewReportLocation
*/

-- delete pre-existing tables & views

DROP TABLE IF EXISTS ReportDisease;
DROP TABLE IF EXISTS ReportSyndrome;
DROP TABLE IF EXISTS ReportLocation;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS Article;
DROP TABLE IF EXISTS EventDate; -- must drop after dropping Article with fk 
DROP TABLE IF EXISTS Disease;
DROP TABLE IF EXISTS Syndrome;

DROP VIEW IF EXISTS ViewReportLocation;
DROP VIEW IF EXISTS ViewReportDisease;
DROP VIEW IF EXISTS ViewReportSyndrome;
DROP VIEW IF EXISTS ViewArticle;
DROP VIEW IF EXISTS ViewReportArticle;
DROP VIEW IF EXISTS ViewReportStartEventDate;
DROP VIEW IF EXISTS ViewReportFinishEventDate;
DROP VIEW IF EXISTS ViewReportReportDisease;
DROP VIEW IF EXISTS ViewReportReportSyndrome;
DROP VIEW IF EXISTS ViewReport;
DROP VIEW IF EXISTS ViewCountReportDisease;
DROP VIEW IF EXISTS ViewCountReportSyndrome;
DROP VIEW IF EXISTS ViewCountDiseaseLocation;

-- unique disease table
-- no duplicates
-- do not modify after setup
CREATE TABLE Disease (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) UNIQUE  -- ensure the name is unique, so no duplicate diseases
);

-- unique syndrome table
-- no duplicates
-- do not modify after setup
CREATE TABLE Syndrome ( -- do we need this?
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) UNIQUE -- ensure the name is unique, so no duplicate diseases
);

-- not unique, duplicate times may exist
CREATE TABLE EventDate (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    daydate date NOT NULL, -- since a date is compulsory, we can use the inbuilt datatype

    -- however, hour and minute might not be set so define these separately 
    hour INT(255), -- Nullable
    minute INT(255) -- Nullable
);

CREATE TABLE Article (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,

    url VARCHAR(255),
    headline VARCHAR(255),
    -- main_VARCHAR(255) VARCHAR(255), -- 100 kb is a very large VARCHAR(255) file
    eventdate_id INT(255),

    FOREIGN KEY(eventdate_id) REFERENCES EventDate(id)
);

CREATE TABLE Report ( 
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,

    article_id INT(255),
    start_eventdate_id INT(255) NOT NULL,
    finish_eventdate_id INT(255), -- Nullable, incase report starts and finishes at the same time
    
    FOREIGN KEY(article_id) REFERENCES Article(id),
    FOREIGN KEY(start_eventdate_id) REFERENCES EventDate(id),
    FOREIGN KEY(finish_eventdate_id) REFERENCES EventDate(id)
);

CREATE TABLE ReportDisease (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    disease_id INT(255),
    report_id INT(255),

    FOREIGN KEY(disease_id) REFERENCES Disease(id),
    FOREIGN KEY(report_id) REFERENCES Report(id)
);

CREATE TABLE ReportSyndrome (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    syndrome_id INT(255),
    report_id INT(255),

    FOREIGN KEY(syndrome_id) REFERENCES Syndrome(id),
    FOREIGN KEY(report_id) REFERENCES Report(id)
);

-- Stores one of the locations of a particular report
-- There can be multiple ReportLocations of the same location (e.g. Sydney), but refer to a different report that coincidentally occured at the same place
CREATE TABLE ReportLocation ( 
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    geonames_id VARCHAR(255), -- reference to geonames ID public database, NOT a foreign key
    report_id INT(255),

    FOREIGN KEY(report_id) REFERENCES Report(id)
);

-- Create some views for easy querying

CREATE VIEW ViewReportLocation AS
    SELECT Report.id AS report_id, ReportLocation.geonames_id
    FROM ReportLocation
    INNER JOIN Report ON ReportLocation.id = Report.id;

CREATE VIEW ViewReportDisease AS
    SELECT Report.id AS report_id, Disease.name AS disease_name
    FROM ReportDisease
    LEFT JOIN Report ON ReportDisease.report_id = Report.id
    LEFT JOIN Disease ON ReportDisease.disease_id = Disease.id;

CREATE VIEW ViewReportSyndrome AS
    SELECT Report.id AS report_id, Syndrome.name AS syndrome_name
    FROM ReportSyndrome
    LEFT JOIN Report ON ReportSyndrome.report_id = Report.id
    LEFT JOIN Syndrome ON ReportSyndrome.syndrome_id = Syndrome.id;

CREATE VIEW ViewArticle AS
    SELECT Article.id, 
           Article.url, 
           Article.headline, 
           EventDate.daydate AS daydate, 
           EventDate.hour AS hour, 
           EventDate.minute AS minute
    FROM Article
    INNER JOIN EventDate ON Article.eventdate_id = EventDate.id;

-- extract report id and article data
CREATE VIEW ViewReportArticle AS
    SELECT Report.id AS report_id, 
           ViewArticle.url AS article_url, 
           ViewArticle.headline AS article_headline, 
           ViewArticle.daydate AS article_daydate, 
           ViewArticle.hour AS article_hour, 
           ViewArticle.minute AS article_minute
    FROM Report
    INNER JOIN ViewArticle ON Report.article_id = ViewArticle.id;

-- extract report id and start time data
CREATE VIEW ViewReportStartEventDate AS
    SELECT Report.id AS report_id, 
           EventDate.daydate AS start_daydate, 
           EventDate.hour AS start_hour, 
           EventDate.minute AS start_minute
    FROM Report
    INNER JOIN EventDate ON Report.start_eventdate_id = EventDate.id;

-- extract report id and finish time data
CREATE VIEW ViewReportFinishEventDate AS
    SELECT Report.id AS report_id, 
           EventDate.daydate AS finish_daydate, 
           EventDate.hour AS finish_hour, 
           EventDate.minute AS finish_minute
    FROM Report
    INNER JOIN EventDate ON Report.finish_eventdate_id = EventDate.id;

CREATE VIEW ViewReportReportDisease AS
    SELECT Report.id AS report_id, JSON_ARRAYAGG(ViewReportDisease.disease_name) AS disease_names
    FROM Report
    INNER JOIN ViewReportDisease ON Report.id = ViewReportDisease.report_id
    GROUP BY Report.id;

CREATE VIEW ViewReportReportSyndrome AS
    SELECT Report.id AS report_id, JSON_ARRAYAGG(ViewReportSyndrome.syndrome_name) AS syndrome_names
    FROM Report
    INNER JOIN ViewReportSyndrome ON Report.id = ViewReportSyndrome.report_id
    GROUP BY Report.id;

CREATE VIEW ViewReport AS
    SELECT Report.id AS report_id,
           ViewReportLocation.geonames_id,
           ViewReportArticle.article_url, -- article content
           ViewReportArticle.article_headline, 
           ViewReportArticle.article_daydate, 
           ViewReportArticle.article_hour, 
           ViewReportArticle.article_minute,
           ViewReportStartEventDate.start_daydate AS report_start_daydate, -- start date
           ViewReportStartEventDate.start_hour AS report_start_hour, 
           ViewReportStartEventDate.start_minute AS report_start_minute ,
           ViewReportFinishEventDate.finish_daydate AS report_finish_daydate, -- finish date
           ViewReportFinishEventDate.finish_hour AS report_finish_hour, 
           ViewReportFinishEventDate.finish_minute AS report_finish_minute,
           ViewReportReportDisease.disease_names AS report_disease_names,
           ViewReportReportSyndrome.syndrome_names AS report_syndrome_names
    FROM Report
    LEFT JOIN ViewReportLocation ON Report.id = ViewReportLocation.report_id
    LEFT JOIN ViewReportArticle ON Report.id = ViewReportArticle.report_id
    LEFT JOIN ViewReportStartEventDate ON Report.id = ViewReportStartEventDate.report_id
    LEFT JOIN ViewReportFinishEventDate ON Report.id = ViewReportFinishEventDate.report_id
    LEFT JOIN ViewReportReportDisease ON Report.id = ViewReportReportDisease.report_id
    LEFT JOIN ViewReportReportSyndrome ON Report.id = ViewReportReportSyndrome.report_id;

-- derivative views
CREATE VIEW ViewCountReportDisease AS
    SELECT COUNT(report_id) AS report_count, disease_name
    FROM ViewReportDisease
    GROUP BY disease_name;

CREATE VIEW ViewCountReportSyndrome AS
    SELECT COUNT(report_id) AS report_count, syndrome_name
    FROM ViewReportSyndrome
    GROUP BY syndrome_name;

CREATE VIEW ViewCountDiseaseLocation AS
    SELECT COUNT(Report.id), ReportDisease.disease_id, ReportLocation.geonames_id
    FROM Report
    LEFT JOIN ReportDisease ON Report.id = ReportDisease.report_id
    LEFT JOIN ReportLocation ON Report.id = ReportLocation.report_id
    GROUP BY ReportDisease.disease_id, ReportLocation.geonames_id;

-- Add each disease manually
INSERT INTO Disease (id, name) VALUES (1, "unknown");
INSERT INTO Disease (id, name) VALUES (2, "other");
INSERT INTO Disease (id, name) VALUES (3, "anthrax cutaneous");
INSERT INTO Disease (id, name) VALUES (4, "anthrax gastrointestinous");
INSERT INTO Disease (id, name) VALUES (5, "anthrax inhalation");
INSERT INTO Disease (id, name) VALUES (6, "botulism");
INSERT INTO Disease (id, name) VALUES (7, "brucellosis");
INSERT INTO Disease (id, name) VALUES (8, "chikungunya");
INSERT INTO Disease (id, name) VALUES (9, "cholera");
INSERT INTO Disease (id, name) VALUES (10, "cryptococcosis");
INSERT INTO Disease (id, name) VALUES (11, "cryptosporidiosis");
INSERT INTO Disease (id, name) VALUES (12, "crimean-congo haemorrhagic fever");
INSERT INTO Disease (id, name) VALUES (13, "dengue");
INSERT INTO Disease (id, name) VALUES (14, "diphteria");
INSERT INTO Disease (id, name) VALUES (15, "ebola haemorrhagic fever");
INSERT INTO Disease (id, name) VALUES (16, "ehec (e.coli)");
INSERT INTO Disease (id, name) VALUES (17, "enterovirus 71 infection");
INSERT INTO Disease (id, name) VALUES (18, "influenza a/h5n1");
INSERT INTO Disease (id, name) VALUES (19, "influenza a/h7n9");
INSERT INTO Disease (id, name) VALUES (20, "influenza a/h9n2");
INSERT INTO Disease (id, name) VALUES (21, "influenza a/h1n1");
INSERT INTO Disease (id, name) VALUES (22, "influenza a/h1n2");
INSERT INTO Disease (id, name) VALUES (23, "influenza a/h3n5");
INSERT INTO Disease (id, name) VALUES (24, "influenza a/h3n2");
INSERT INTO Disease (id, name) VALUES (25, "influenza a/h2n2");
INSERT INTO Disease (id, name) VALUES (26, "hand, foot and mouth disease");
INSERT INTO Disease (id, name) VALUES (27, "hantavirus");
INSERT INTO Disease (id, name) VALUES (28, "hepatitis a");
INSERT INTO Disease (id, name) VALUES (29, "hepatitis b");
INSERT INTO Disease (id, name) VALUES (30, "hepatitis c");
INSERT INTO Disease (id, name) VALUES (31, "hepatitis d");
INSERT INTO Disease (id, name) VALUES (32, "hepatitis e");
INSERT INTO Disease (id, name) VALUES (33, "histoplasmosis");
INSERT INTO Disease (id, name) VALUES (34, "hiv/aids");
INSERT INTO Disease (id, name) VALUES (35, "lassa fever");
INSERT INTO Disease (id, name) VALUES (36, "malaria");
INSERT INTO Disease (id, name) VALUES (37, "marburg virus disease");
INSERT INTO Disease (id, name) VALUES (38, "measles");
INSERT INTO Disease (id, name) VALUES (39, "mers-cov");
INSERT INTO Disease (id, name) VALUES (40, "mumps");
INSERT INTO Disease (id, name) VALUES (41, "nipah virus");
INSERT INTO Disease (id, name) VALUES (42, "norovirus infection");
INSERT INTO Disease (id, name) VALUES (43, "pertussis");
INSERT INTO Disease (id, name) VALUES (44, "plague");
INSERT INTO Disease (id, name) VALUES (45, "pneumococcus pneumonia");
INSERT INTO Disease (id, name) VALUES (46, "poliomyelitis");
INSERT INTO Disease (id, name) VALUES (47, "q fever");
INSERT INTO Disease (id, name) VALUES (48, "rabies");
INSERT INTO Disease (id, name) VALUES (49, "rift valley fever");
INSERT INTO Disease (id, name) VALUES (50, "rotavirus infection");
INSERT INTO Disease (id, name) VALUES (51, "rubella");
INSERT INTO Disease (id, name) VALUES (52, "salmonellosis");
INSERT INTO Disease (id, name) VALUES (53, "sars");
INSERT INTO Disease (id, name) VALUES (54, "shigellosis");
INSERT INTO Disease (id, name) VALUES (55, "smallpox");
INSERT INTO Disease (id, name) VALUES (56, "staphylococcal enterotoxin b");
INSERT INTO Disease (id, name) VALUES (57, "thypoid fever");
INSERT INTO Disease (id, name) VALUES (58, "tuberculosis");
INSERT INTO Disease (id, name) VALUES (59, "tularemia");
INSERT INTO Disease (id, name) VALUES (60, "vaccinia and cowpox");
INSERT INTO Disease (id, name) VALUES (61, "varicella");
INSERT INTO Disease (id, name) VALUES (62, "west nile virus");
INSERT INTO Disease (id, name) VALUES (63, "yellow fever");
INSERT INTO Disease (id, name) VALUES (64, "yersiniosis");
INSERT INTO Disease (id, name) VALUES (65, "zika");
INSERT INTO Disease (id, name) VALUES (66, "legionares");
INSERT INTO Disease (id, name) VALUES (67, "listeriosis");
INSERT INTO Disease (id, name) VALUES (68, "monkeypox");
INSERT INTO Disease (id, name) VALUES (69, "COVID-19");

-- add each syndrome manually
INSERT INTO Syndrome (id, name) VALUES (1, "Haemorrhagic Fever");
INSERT INTO Syndrome (id, name) VALUES (2, "Acute Flacid Paralysis");
INSERT INTO Syndrome (id, name) VALUES (3, "Acute gastroenteritis");
INSERT INTO Syndrome (id, name) VALUES (4, "Acute respiratory syndrome");
INSERT INTO Syndrome (id, name) VALUES (5, "Influenza-like illness");
INSERT INTO Syndrome (id, name) VALUES (6, "Acute fever and rash");
INSERT INTO Syndrome (id, name) VALUES (7, "Fever of unknown Origin");
INSERT INTO Syndrome (id, name) VALUES (8, "Encephalitis");
INSERT INTO Syndrome (id, name) VALUES (9, "Meningitis");