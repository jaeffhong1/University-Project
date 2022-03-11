/*
    SQL Database Build/Setup
    WARNING: Running this will delete all database data
    This will create the required tables with the correct structure for initialising the database.
    
    Tables:
        - Diseases          (id[PK], name)
        - Syndromes         (id[PK], name)
        - ReportDiseases    (id[PK], disease_id[FK], report_id[FK])
        - ReportSyndromes
        - ReportLocations   (id[PK], geonames_id, report_id[FK])
        - EventDates        (id[PK], daydate, hour, minute)
        - Articles          (id[PK], url, headline, edate[FK])
        - Reports           (id[PK], article_id[FK], eventdate_start_id[FK], eventdate_finish_id[FK])

    Todo:
        - Add report procedure
        - Read report (with all data) proc
        - ViewReportLocation
*/

-- delete pre-existing tables & views

DROP TABLE IF EXISTS ReportDiseases;
DROP TABLE IF EXISTS ReportSyndromes;
DROP TABLE IF EXISTS ReportLocation;
DROP TABLE IF EXISTS Reports;
DROP TABLE IF EXISTS Articles;
DROP TABLE IF EXISTS EventDates; -- must drop after dropping Article with fk 
DROP TABLE IF EXISTS Diseases;
DROP TABLE IF EXISTS Syndromes;

DROP VIEW IF EXISTS ViewReportLocations;
DROP VIEW IF EXISTS ViewReportDiseases;
DROP VIEW IF EXISTS ViewReportSyndromes;
DROP VIEW IF EXISTS ViewArticles;
DROP VIEW IF EXISTS ViewReportArticles;
DROP VIEW IF EXISTS ViewReportStartEventDates;
DROP VIEW IF EXISTS ViewReportFinishEventDates;
DROP VIEW IF EXISTS ViewReportReportDiseases;
DROP VIEW IF EXISTS ViewReportReportSyndromes;
DROP VIEW IF EXISTS ViewReports;
DROP VIEW IF EXISTS ViewCountReportDiseases;
DROP VIEW IF EXISTS ViewCountReportSyndromes;
DROP VIEW IF EXISTS ViewCountDiseasesLocations;

-- unique Diseases table
-- no duplicates
-- do not modify after setup
CREATE TABLE Diseases (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) UNIQUE  -- ensure the name is unique, so no duplicate diseases
);

-- unique syndrome table
-- no duplicates
-- do not modify after setup
CREATE TABLE Syndromes ( -- do we need this?
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) UNIQUE -- ensure the name is unique, so no duplicate diseases
);

-- not unique, duplicate times may exist
CREATE TABLE EventDates (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    daydate date NOT NULL, -- since a date is compulsory, we can use the inbuilt datatype

    -- however, hour and minute might not be set so define these separately 
    hour INT(255), -- Nullable
    minute INT(255) -- Nullable
);

CREATE TABLE Articles (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,

    url VARCHAR(255),
    headline VARCHAR(255),
    -- main_VARCHAR(255) VARCHAR(255), -- 100 kb is a very large VARCHAR(255) file
    eventdate_id INT(255),

    FOREIGN KEY(eventdate_id) REFERENCES EventDates(id)
);

CREATE TABLE Reports ( 
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,

    article_id INT(255),
    start_eventdate_id INT(255) NOT NULL,
    finish_eventdate_id INT(255), -- Nullable, incase report starts and finishes at the same time
    
    FOREIGN KEY(article_id) REFERENCES Articles(id),
    FOREIGN KEY(start_eventdate_id) REFERENCES EventDates(id),
    FOREIGN KEY(finish_eventdate_id) REFERENCES EventDates(id)
);

CREATE TABLE ReportDiseases (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    disease_id INT(255),
    report_id INT(255),

    FOREIGN KEY(disease_id) REFERENCES Diseases(id),
    FOREIGN KEY(report_id) REFERENCES Reports(id)
);

CREATE TABLE ReportSyndromes (
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    syndrome_id INT(255),
    report_id INT(255),

    FOREIGN KEY(syndrome_id) REFERENCES Syndromes(id),
    FOREIGN KEY(report_id) REFERENCES Reports(id)
);

-- Stores one of the locations of a particular report
-- There can be multiple ReportLocations of the same location (e.g. Sydney), but refer to a different report that coincidentally occured at the same place
CREATE TABLE ReportLocations ( 
    id INT(255) UNIQUE NOT NULL PRIMARY KEY AUTO_INCREMENT,
    geonames_id VARCHAR(255), -- reference to geonames ID public database, NOT a foreign key
    report_id INT(255),

    FOREIGN KEY(report_id) REFERENCES Reports(id)
);

-- Create some views for easy querying

CREATE VIEW ViewReportLocations AS
    SELECT Reports.id AS report_id, ReportLocation.geonames_id
    FROM ReportLocation
    INNER JOIN Reports ON ReportLocation.id = Reports.id;

CREATE VIEW ViewReportDiseases AS
    SELECT Reports.id AS report_id, Diseases.name AS disease_name
    FROM ReportDiseases
    LEFT JOIN Reports ON ReportDiseases.report_id = Reports.id
    LEFT JOIN Diseases ON ReportDiseases.disease_id = Diseases.id;

CREATE VIEW ViewReportSyndromes AS
    SELECT Reports.id AS report_id, Syndromes.name AS syndrome_name
    FROM ReportSyndromes
    LEFT JOIN Reports ON ReportSyndromes.report_id = Reports.id
    LEFT JOIN Syndromes ON ReportSyndromes.syndrome_id = Syndromes.id;

CREATE VIEW ViewArticles AS
    SELECT Articles.id, 
           Articles.url, 
           Articles.headline, 
           EventDates.daydate AS daydate, 
           EventDates.hour AS hour, 
           EventDates.minute AS minute
    FROM Articles
    INNER JOIN EventDates ON Articles.eventdate_id = EventDates.id;

-- extract report id and article data
CREATE VIEW ViewReportArticles AS
    SELECT Reports.id AS report_id, 
           ViewArticle.url AS article_url, 
           ViewArticle.headline AS article_headline, 
           ViewArticle.daydate AS article_daydate, 
           ViewArticle.hour AS article_hour, 
           ViewArticle.minute AS article_minute
    FROM Reports
    INNER JOIN ViewArticle ON Reports.article_id = ViewArticle.id;

-- extract report id and start time data
CREATE VIEW ViewReportStartEventDate AS
    SELECT Reports.id AS report_id, 
           EventDate.daydate AS start_daydate, 
           EventDate.hour AS start_hour, 
           EventDate.minute AS start_minute
    FROM Reports
    INNER JOIN EventDate ON Reports.start_eventdate_id = EventDate.id;

-- extract report id and finish time data
CREATE VIEW ViewReportFinishEventDate AS
    SELECT Reports.id AS report_id, 
           EventDates.daydate AS finish_daydate, 
           EventDates.hour AS finish_hour, 
           EventDates.minute AS finish_minute
    FROM Reports
    INNER JOIN EventDates ON Reports.finish_eventdate_id = EventDates.id;

CREATE VIEW ViewReportReportDiseases AS
    SELECT Reports.id AS report_id, JSON_ARRAYAGG(ViewReportDiseases.disease_name) AS disease_names
    FROM Reports
    INNER JOIN ViewReportDiseases ON Reports.id = ViewReportDiseases.report_id
    GROUP BY Reports.id;

CREATE VIEW ViewReportReportSyndromes AS
    SELECT Reports.id AS report_id, JSON_ARRAYAGG(ViewReportSyndromes.syndrome_name) AS syndrome_names
    FROM Reports
    INNER JOIN ViewReportSyndromes ON Reports.id = ViewReportSyndromes.report_id
    GROUP BY Reports.id;

CREATE VIEW ViewReports AS
    SELECT Reports.id AS report_id,
           ViewReportLocations.geonames_id,
           ViewReportArticles.article_url, -- article content
           ViewReportArticles.article_headline, 
           ViewReportArticles.article_daydate, 
           ViewReportArticles.article_hour, 
           ViewReportArticles.article_minute,
           ViewReportStartEventDates.start_daydate AS report_start_daydate, -- start date
           ViewReportStartEventDates.start_hour AS report_start_hour, 
           ViewReportStartEventDates.start_minute AS report_start_minute ,
           ViewReportFinishEventDates.finish_daydate AS report_finish_daydate, -- finish date
           ViewReportFinishEventDates.finish_hour AS report_finish_hour, 
           ViewReportFinishEventDates.finish_minute AS report_finish_minute,
           ViewReportReportDiseases.disease_names AS report_disease_names,
           ViewReportReportSyndromes.syndrome_names AS report_syndrome_names
    FROM Reports
    LEFT JOIN ViewReportLocations ON Reports.id = ViewReportLocations.report_id
    LEFT JOIN ViewReportArticles ON Reports.id = ViewReportArticles.report_id
    LEFT JOIN ViewReportStartEventDates ON Reports.id = ViewReportStartEventDates.report_id
    LEFT JOIN ViewReportFinishEventDates ON Reports.id = ViewReportFinishEventDates.report_id
    LEFT JOIN ViewReportReportDiseases ON Reports.id = ViewReportReportDiseasess.report_id
    LEFT JOIN ViewReportReportSyndromes ON Reports.id = ViewReportReportSyndromess.report_id;

-- derivative views
CREATE VIEW ViewCountReportDiseases AS
    SELECT COUNT(report_id) AS report_count, disease_name
    FROM ViewReportDiseases
    GROUP BY disease_name;

CREATE VIEW ViewCountReportSyndromes AS
    SELECT COUNT(report_id) AS report_count, syndrome_name
    FROM ViewReportSyndromes
    GROUP BY syndrome_name;

CREATE VIEW ViewCountDiseasesLocations AS
    SELECT COUNT(Reports.id), ReportDiseases.disease_id, ReportLocations.geonames_id
    FROM Reports
    LEFT JOIN ReportDiseases ON Reports.id = ReportDiseases.report_id
    LEFT JOIN ReportLocations ON Reports.id = ReportLocations.report_id
    GROUP BY ReportDiseases.disease_id, ReportLocations.geonames_id;

-- Add each disease manually
INSERT INTO Diseases (id, name) VALUES (1, "unknown");
INSERT INTO Diseases (id, name) VALUES (2, "other");
INSERT INTO Diseases (id, name) VALUES (3, "anthrax cutaneous");
INSERT INTO Diseases (id, name) VALUES (4, "anthrax gastrointestinous");
INSERT INTO Diseases (id, name) VALUES (5, "anthrax inhalation");
INSERT INTO Diseases (id, name) VALUES (6, "botulism");
INSERT INTO Diseases (id, name) VALUES (7, "brucellosis");
INSERT INTO Diseases (id, name) VALUES (8, "chikungunya");
INSERT INTO Diseases (id, name) VALUES (9, "cholera");
INSERT INTO Diseases (id, name) VALUES (10, "cryptococcosis");
INSERT INTO Diseases (id, name) VALUES (11, "cryptosporidiosis");
INSERT INTO Diseases (id, name) VALUES (12, "crimean-congo haemorrhagic fever");
INSERT INTO Diseases (id, name) VALUES (13, "dengue");
INSERT INTO Diseases (id, name) VALUES (14, "diphteria");
INSERT INTO Diseases (id, name) VALUES (15, "ebola haemorrhagic fever");
INSERT INTO Diseases (id, name) VALUES (16, "ehec (e.coli)");
INSERT INTO Diseases (id, name) VALUES (17, "enterovirus 71 infection");
INSERT INTO Diseases (id, name) VALUES (18, "influenza a/h5n1");
INSERT INTO Diseases (id, name) VALUES (19, "influenza a/h7n9");
INSERT INTO Diseases (id, name) VALUES (20, "influenza a/h9n2");
INSERT INTO Diseases (id, name) VALUES (21, "influenza a/h1n1");
INSERT INTO Diseases (id, name) VALUES (22, "influenza a/h1n2");
INSERT INTO Diseases (id, name) VALUES (23, "influenza a/h3n5");
INSERT INTO Diseases (id, name) VALUES (24, "influenza a/h3n2");
INSERT INTO Diseases (id, name) VALUES (25, "influenza a/h2n2");
INSERT INTO Diseases (id, name) VALUES (26, "hand, foot and mouth disease");
INSERT INTO Diseases (id, name) VALUES (27, "hantavirus");
INSERT INTO Diseases (id, name) VALUES (28, "hepatitis a");
INSERT INTO Diseases (id, name) VALUES (29, "hepatitis b");
INSERT INTO Diseases (id, name) VALUES (30, "hepatitis c");
INSERT INTO Diseases (id, name) VALUES (31, "hepatitis d");
INSERT INTO Diseases (id, name) VALUES (32, "hepatitis e");
INSERT INTO Diseases (id, name) VALUES (33, "histoplasmosis");
INSERT INTO Diseases (id, name) VALUES (34, "hiv/aids");
INSERT INTO Diseases (id, name) VALUES (35, "lassa fever");
INSERT INTO Diseases (id, name) VALUES (36, "malaria");
INSERT INTO Diseases (id, name) VALUES (37, "marburg virus disease");
INSERT INTO Diseases (id, name) VALUES (38, "measles");
INSERT INTO Diseases (id, name) VALUES (39, "mers-cov");
INSERT INTO Diseases (id, name) VALUES (40, "mumps");
INSERT INTO Diseases (id, name) VALUES (41, "nipah virus");
INSERT INTO Diseases (id, name) VALUES (42, "norovirus infection");
INSERT INTO Diseases (id, name) VALUES (43, "pertussis");
INSERT INTO Diseases (id, name) VALUES (44, "plague");
INSERT INTO Diseases (id, name) VALUES (45, "pneumococcus pneumonia");
INSERT INTO Diseases (id, name) VALUES (46, "poliomyelitis");
INSERT INTO Diseases (id, name) VALUES (47, "q fever");
INSERT INTO Diseases (id, name) VALUES (48, "rabies");
INSERT INTO Diseases (id, name) VALUES (49, "rift valley fever");
INSERT INTO Diseases (id, name) VALUES (50, "rotavirus infection");
INSERT INTO Diseases (id, name) VALUES (51, "rubella");
INSERT INTO Diseases (id, name) VALUES (52, "salmonellosis");
INSERT INTO Diseases (id, name) VALUES (53, "sars");
INSERT INTO Diseases (id, name) VALUES (54, "shigellosis");
INSERT INTO Diseases (id, name) VALUES (55, "smallpox");
INSERT INTO Diseases (id, name) VALUES (56, "staphylococcal enterotoxin b");
INSERT INTO Diseases (id, name) VALUES (57, "thypoid fever");
INSERT INTO Diseases (id, name) VALUES (58, "tuberculosis");
INSERT INTO Diseases (id, name) VALUES (59, "tularemia");
INSERT INTO Diseases (id, name) VALUES (60, "vaccinia and cowpox");
INSERT INTO Diseases (id, name) VALUES (61, "varicella");
INSERT INTO Diseases (id, name) VALUES (62, "west nile virus");
INSERT INTO Diseases (id, name) VALUES (63, "yellow fever");
INSERT INTO Diseases (id, name) VALUES (64, "yersiniosis");
INSERT INTO Diseases (id, name) VALUES (65, "zika");
INSERT INTO Diseases (id, name) VALUES (66, "legionares");
INSERT INTO Diseases (id, name) VALUES (67, "listeriosis");
INSERT INTO Diseases (id, name) VALUES (68, "monkeypox");
INSERT INTO Diseases (id, name) VALUES (69, "COVID-19");

-- add each syndrome manually
INSERT INTO Syndromes (id, name) VALUES (1, "Haemorrhagic Fever");
INSERT INTO Syndromes (id, name) VALUES (2, "Acute Flacid Paralysis");
INSERT INTO Syndromes (id, name) VALUES (3, "Acute gastroenteritis");
INSERT INTO Syndromes (id, name) VALUES (4, "Acute respiratory syndrome");
INSERT INTO Syndromes (id, name) VALUES (5, "Influenza-like illness");
INSERT INTO Syndromes (id, name) VALUES (6, "Acute fever and rash");
INSERT INTO Syndromes (id, name) VALUES (7, "Fever of unknown Origin");
INSERT INTO Syndromes (id, name) VALUES (8, "Encephalitis");
INSERT INTO Syndromes (id, name) VALUES (9, "Meningitis");