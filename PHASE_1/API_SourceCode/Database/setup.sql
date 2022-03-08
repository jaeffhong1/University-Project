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
*/

-- delete pre-existing tables & views
DROP TABLE IF EXISTS Disease;
DROP TABLE IF EXISTS Syndrome;
DROP TABLE IF EXISTS ReportDisease;
DROP TABLE IF EXISTS ReportSyndrome;
DROP TABLE IF EXISTS ReportLocation;
DROP TABLE IF EXISTS EventDate;
DROP TABLE IF EXISTS Article;
DROP TABLE IF EXISTS Report;

DROP VIEW IF EXISTS ViewReportDisease;
DROP VIEW IF EXISTS ViewReportSyndrome;
DROP VIEW IF EXISTS ViewArticle;
DROP VIEW IF EXISTS ViewReportArticle;
DROP VIEW IF EXISTS ViewReportStartEventDate;
DROP VIEW IF EXISTS ViewReportFinishEventDate;
DROP VIEW IF EXISTS ViewReport;

-- unique disease table
-- no duplicates
-- do not modify after setup
CREATE TABLE Disease (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name UNIQUE VARCHAR(128), -- ensure the name is unique, so no duplicate diseases
);

-- unique syndrome table
-- no duplicates
-- do not modify after setup
CREATE TABLE Syndrome ( -- do we need this?
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name UNIQUE VARCHAR(128) -- ensure the name is unique, so no duplicate diseases
);

CREATE TABLE ReportDisease (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    disease_id INTEGER FOREIGN KEY REFERENCES Disease(id)
);

CREATE TABLE ReportSyndrome (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    syndrome_id INTEGER FOREIGN KEY REFERENCES Syndrome(id)
);

-- Stores one of the locations of a particular report
-- There can be multiple ReportLocations of the same location (e.g. Sydney), but refer to a different report that coincidentally occured at the same place
CREATE TABLE ReportLocation ( 
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    geonames_id VARCHAR(255) -- reference to geonames ID public database, NOT a foreign key
    report_id INTEGER FOREIGN KEY REFERENCES Report(id),
);

-- not unique, duplicate times may exist
CREATE TABLE EventDate (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    daydate date NOT NULL, -- since a date is compulsory, we can use the inbuilt datatype

    -- however, hour and minute might not be set so define these separately 
    hour INTEGER, -- Nullable
    minute INTEGER -- Nullable
);

CREATE TABLE Article (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,

    url VARCHAR(512),
    headline VARCHAR(255),
    -- main_text VARCHAR(100000), -- 100 kb is a very large text file
    eventdate_id INTEGER FOREIGN KEY REFERENCES EventDate(id)
);

CREATE TABLE Report ( 
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,

    article_id INTEGER FOREIGN KEY REFERENCES Article(id)
    --report_location_id INTEGER FOREIGN KEY REFERENCES ReportLocation(id),

    start_eventdate_id INTEGER NOT NULL FOREIGN KEY REFERENCES EventDate(id),
    finish_eventdate_id INTEGER FOREIGN KEY REFERENCES EventDate(id) -- Nullable, incase report starts and finishes at the same time
    
    --report_disease_id INTEGER FOREIGN KEY REFERENCES ReportDisease(id),
    --report_syndrome_id INTEGER FOREIGN KEY REFERENCES ReportSyndrome(id)
);

-- Create some views for easy querying
-- Retrieve the name of the disease from a ReportDisease instead of the Disease id
CREATE VIEW ViewReportDisease AS
    SELECT ReportDisease.id, Disease.name
    FROM ReportDisease
    INNER JOIN Disease ON ReportDisease.disease_id = Disease.id;

CREATE VIEW ViewReportSyndrome AS
    SELECT ReportSyndrome.id, Syndrome.name
    FROM ReportSyndrome
    INNER JOIN Syndrome ON ReportSyndrome.syndrome_id = Syndrome.id;

CREATE VIEW ViewArticle AS
    SELECT Article.id, 
           Article.url, 
           Article.headline, 
           EventDate.daydate AS daydate_published, 
           EventDate.hour AS hour_published, 
           EventDate.minute AS minute_published
    FROM Article
    INNER JOIN EventDate ON Article.eventdate_id = EventDate.id;

-- extract report id and article data
CREATE VIEW ViewReportArticle AS
    SELECT Report.id AS report_id, 
           ViewArticle.url AS article_url, 
           ViewArticle.headline AS article_headline, 
           ViewArticle.daydate_published AS article_daydate_published, 
           ViewArticle.hour_published AS article_hour_published, 
           ViewArticle.minute_published AS article_minute_published
    FROM Report
    INNER JOIN ViewArticle ON Report.article_id = ViewArticle.id;

-- extract report id and start time data
CREATE VIEW ViewReportStartEventDate AS
    SELECT Report.id AS report_id, 
           EventDate.edate AS start_edate_edate, 
           EventDate.hour AS start_edate_hour, 
           EventDate.minute AS start_edate_minute
    FROM Report
    INNER JOIN EventDate ON Report.start_eventdate_id = EventDate.id;

-- extract report id and finish time data
CREATE VIEW ViewReportFinishEventDate AS
    SELECT Report.id AS report_id, 
           EventDate.edate AS finish_edate_edate, 
           EventDate.hour AS finish_edate_hour, 
           EventDate.minute AS finish_edate_minute
    FROM Report
    INNER JOIN EventDate ON Report.finish_eventdate_id = EventDate.id;

CREATE VIEW ViewReport AS
    SELECT Report.id AS report_id,

           -- article content
           ViewReportArticle.article_url, 
           ViewReportArticle.article_headline, 
           ViewReportArticle.article_daydate_published, 
           ViewReportArticle.article_hour_published, 
           ViewReportArticle.article_minute_published,

           -- start date
           ViewReportStartEventDate.start_edate_edate, 
           ViewReportStartEventDate.start_edate_hour, 
           ViewReportStartEventDate.start_edate_minute

           -- finish date
           ViewReportFinishEventDate.finish_edate_edate, 
           ViewReportFinishEventDate.finish_edate_hour, 
           ViewReportFinishEventDate.finish_edate_minute
    FROM Report
    INNER JOIN ViewReportArticle ON Report.id = ViewReportArticle.report_id
    INNER JOIN ViewReportStartEventDate ON Report.id = ViewReportStartEventDate.report_id
    INNER JOIN ViewReportFinishEventDate ON Report.id = ViewReportFinishEventDate.report_id;




-- create some views for quick reference
--CREATE VIEW ViewReport AS
--    SELECT Article.url, Article.headline, 
--    FROM table_name
--    WHERE condition;

-- Add each disease manually
INSERT INTO Disease (id, name) VALUES (0, "unknown");
INSERT INTO Disease (id, name) VALUES (1, "other");
INSERT INTO Disease (id, name) VALUES (2, "anthrax cutaneous");
INSERT INTO Disease (id, name) VALUES (3, "anthrax gastrointestinous");
INSERT INTO Disease (id, name) VALUES (4, "anthrax inhalation");
INSERT INTO Disease (id, name) VALUES (5, "botulism");
INSERT INTO Disease (id, name) VALUES (6, "brucellosis");
INSERT INTO Disease (id, name) VALUES (7, "chikungunya");
INSERT INTO Disease (id, name) VALUES (8, "cholera");
INSERT INTO Disease (id, name) VALUES (9, "cryptococcosis");
INSERT INTO Disease (id, name) VALUES (10, "cryptosporidiosis");
INSERT INTO Disease (id, name) VALUES (11, "crimean-congo haemorrhagic fever");
INSERT INTO Disease (id, name) VALUES (12, "dengue");
INSERT INTO Disease (id, name) VALUES (13, "diphteria");
INSERT INTO Disease (id, name) VALUES (14, "ebola haemorrhagic fever");
INSERT INTO Disease (id, name) VALUES (15, "ehec (e.coli)");
INSERT INTO Disease (id, name) VALUES (16, "enterovirus 71 infection");
INSERT INTO Disease (id, name) VALUES (17, "influenza a/h5n1");
INSERT INTO Disease (id, name) VALUES (18, "influenza a/h7n9");
INSERT INTO Disease (id, name) VALUES (19, "influenza a/h9n2");
INSERT INTO Disease (id, name) VALUES (20, "influenza a/h1n1");
INSERT INTO Disease (id, name) VALUES (21, "influenza a/h1n2");
INSERT INTO Disease (id, name) VALUES (22, "influenza a/h3n5");
INSERT INTO Disease (id, name) VALUES (23, "influenza a/h3n2");
INSERT INTO Disease (id, name) VALUES (24, "influenza a/h2n2");
INSERT INTO Disease (id, name) VALUES (25, "hand, foot and mouth disease");
INSERT INTO Disease (id, name) VALUES (26, "hantavirus");
INSERT INTO Disease (id, name) VALUES (27, "hepatitis a");
INSERT INTO Disease (id, name) VALUES (28, "hepatitis b");
INSERT INTO Disease (id, name) VALUES (29, "hepatitis c");
INSERT INTO Disease (id, name) VALUES (30, "hepatitis d");
INSERT INTO Disease (id, name) VALUES (31, "hepatitis e");
INSERT INTO Disease (id, name) VALUES (32, "histoplasmosis");
INSERT INTO Disease (id, name) VALUES (33, "hiv/aids");
INSERT INTO Disease (id, name) VALUES (34, "lassa fever");
INSERT INTO Disease (id, name) VALUES (35, "malaria");
INSERT INTO Disease (id, name) VALUES (36, "marburg virus disease");
INSERT INTO Disease (id, name) VALUES (37, "measles");
INSERT INTO Disease (id, name) VALUES (38, "mers-cov");
INSERT INTO Disease (id, name) VALUES (39, "mumps");
INSERT INTO Disease (id, name) VALUES (40, "nipah virus");
INSERT INTO Disease (id, name) VALUES (41, "norovirus infection");
INSERT INTO Disease (id, name) VALUES (42, "pertussis");
INSERT INTO Disease (id, name) VALUES (43, "plague");
INSERT INTO Disease (id, name) VALUES (44, "pneumococcus pneumonia");
INSERT INTO Disease (id, name) VALUES (45, "poliomyelitis");
INSERT INTO Disease (id, name) VALUES (46, "q fever");
INSERT INTO Disease (id, name) VALUES (47, "rabies");
INSERT INTO Disease (id, name) VALUES (48, "rift valley fever");
INSERT INTO Disease (id, name) VALUES (49, "rotavirus infection");
INSERT INTO Disease (id, name) VALUES (50, "rubella");
INSERT INTO Disease (id, name) VALUES (51, "salmonellosis");
INSERT INTO Disease (id, name) VALUES (52, "sars");
INSERT INTO Disease (id, name) VALUES (53, "shigellosis");
INSERT INTO Disease (id, name) VALUES (54, "smallpox");
INSERT INTO Disease (id, name) VALUES (55, "staphylococcal enterotoxin b");
INSERT INTO Disease (id, name) VALUES (56, "thypoid fever");
INSERT INTO Disease (id, name) VALUES (57, "tuberculosis");
INSERT INTO Disease (id, name) VALUES (58, "tularemia");
INSERT INTO Disease (id, name) VALUES (59, "vaccinia and cowpox");
INSERT INTO Disease (id, name) VALUES (60, "varicella");
INSERT INTO Disease (id, name) VALUES (61, "west nile virus");
INSERT INTO Disease (id, name) VALUES (62, "yellow fever");
INSERT INTO Disease (id, name) VALUES (63, "yersiniosis");
INSERT INTO Disease (id, name) VALUES (64, "zika");
INSERT INTO Disease (id, name) VALUES (65, "legionares");
INSERT INTO Disease (id, name) VALUES (66, "listeriosis");
INSERT INTO Disease (id, name) VALUES (67, "monkeypox");
INSERT INTO Disease (id, name) VALUES (68, "COVID-19");

-- add each syndrome manually
INSERT INTO Syndrome (id, name) VALUES (0, "unknown");
INSERT INTO Syndrome (id, name) VALUES (1, "other");
INSERT INTO Syndrome (id, name) VALUES (2, "anthrax cutaneous");
INSERT INTO Syndrome (id, name) VALUES (3, "anthrax gastrointestinous");
INSERT INTO Syndrome (id, name) VALUES (4, "anthrax inhalation");
INSERT INTO Syndrome (id, name) VALUES (5, "botulism");
INSERT INTO Syndrome (id, name) VALUES (6, "brucellosis");
INSERT INTO Syndrome (id, name) VALUES (7, "chikungunya");
INSERT INTO Syndrome (id, name) VALUES (8, "cholera");
INSERT INTO Syndrome (id, name) VALUES (9, "cryptococcosis");
INSERT INTO Syndrome (id, name) VALUES (10, "cryptosporidiosis");
INSERT INTO Syndrome (id, name) VALUES (11, "crimean-congo haemorrhagic fever");
INSERT INTO Syndrome (id, name) VALUES (12, "dengue");
INSERT INTO Syndrome (id, name) VALUES (13, "diphteria");
INSERT INTO Syndrome (id, name) VALUES (14, "ebola haemorrhagic fever");
INSERT INTO Syndrome (id, name) VALUES (15, "ehec (e.coli)");
INSERT INTO Syndrome (id, name) VALUES (16, "enterovirus 71 infection");
INSERT INTO Syndrome (id, name) VALUES (17, "influenza a/h5n1");
INSERT INTO Syndrome (id, name) VALUES (18, "influenza a/h7n9");
INSERT INTO Syndrome (id, name) VALUES (19, "influenza a/h9n2");
INSERT INTO Syndrome (id, name) VALUES (20, "influenza a/h1n1");
INSERT INTO Syndrome (id, name) VALUES (21, "influenza a/h1n2");
INSERT INTO Syndrome (id, name) VALUES (22, "influenza a/h3n5");
INSERT INTO Syndrome (id, name) VALUES (23, "influenza a/h3n2");
INSERT INTO Syndrome (id, name) VALUES (24, "influenza a/h2n2");
INSERT INTO Syndrome (id, name) VALUES (25, "hand, foot and mouth disease");
INSERT INTO Syndrome (id, name) VALUES (26, "hantavirus");
INSERT INTO Syndrome (id, name) VALUES (27, "hepatitis a");
INSERT INTO Syndrome (id, name) VALUES (28, "hepatitis b");
INSERT INTO Syndrome (id, name) VALUES (29, "hepatitis c");
INSERT INTO Syndrome (id, name) VALUES (30, "hepatitis d");
INSERT INTO Syndrome (id, name) VALUES (31, "hepatitis e");
INSERT INTO Syndrome (id, name) VALUES (32, "histoplasmosis");
INSERT INTO Syndrome (id, name) VALUES (33, "hiv/aids");
INSERT INTO Syndrome (id, name) VALUES (34, "lassa fever");
INSERT INTO Syndrome (id, name) VALUES (35, "malaria");
INSERT INTO Syndrome (id, name) VALUES (36, "marburg virus disease");
INSERT INTO Syndrome (id, name) VALUES (37, "measles");
INSERT INTO Syndrome (id, name) VALUES (38, "mers-cov");
INSERT INTO Syndrome (id, name) VALUES (39, "mumps");
INSERT INTO Syndrome (id, name) VALUES (40, "nipah virus");
INSERT INTO Syndrome (id, name) VALUES (41, "norovirus infection");
INSERT INTO Syndrome (id, name) VALUES (42, "pertussis");
INSERT INTO Syndrome (id, name) VALUES (43, "plague");
INSERT INTO Syndrome (id, name) VALUES (44, "pneumococcus pneumonia");
INSERT INTO Syndrome (id, name) VALUES (45, "poliomyelitis");
INSERT INTO Syndrome (id, name) VALUES (46, "q fever");
INSERT INTO Syndrome (id, name) VALUES (47, "rabies");
INSERT INTO Syndrome (id, name) VALUES (48, "rift valley fever");
INSERT INTO Syndrome (id, name) VALUES (49, "rotavirus infection");
INSERT INTO Syndrome (id, name) VALUES (50, "rubella");
INSERT INTO Syndrome (id, name) VALUES (51, "salmonellosis");
INSERT INTO Syndrome (id, name) VALUES (52, "sars");
INSERT INTO Syndrome (id, name) VALUES (53, "shigellosis");
INSERT INTO Syndrome (id, name) VALUES (54, "smallpox");
INSERT INTO Syndrome (id, name) VALUES (55, "staphylococcal enterotoxin b");
INSERT INTO Syndrome (id, name) VALUES (56, "thypoid fever");
INSERT INTO Syndrome (id, name) VALUES (57, "tuberculosis");
INSERT INTO Syndrome (id, name) VALUES (58, "tularemia");
INSERT INTO Syndrome (id, name) VALUES (59, "vaccinia and cowpox");
INSERT INTO Syndrome (id, name) VALUES (60, "varicella");
INSERT INTO Syndrome (id, name) VALUES (61, "west nile virus");
INSERT INTO Syndrome (id, name) VALUES (62, "yellow fever");
INSERT INTO Syndrome (id, name) VALUES (63, "yersiniosis");
INSERT INTO Syndrome (id, name) VALUES (64, "zika");
INSERT INTO Syndrome (id, name) VALUES (65, "legionares");
INSERT INTO Syndrome (id, name) VALUES (66, "listeriosis");
INSERT INTO Syndrome (id, name) VALUES (67, "monkeypox");
INSERT INTO Syndrome (id, name) VALUES (68, "COVID-19");