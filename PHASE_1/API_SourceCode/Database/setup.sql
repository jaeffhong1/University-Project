/*
    SQL Database Build/Setup
    WARNING: Running this will delete all database data
    This will create the required tables with the correct structure for initialising the database.
    
    Tables:
        - Disease           (id[PK], name)
        - Syndrome          (id[PK], name)
        - Location          (id[PK], geonames_id)
        - ReportDisease     (id[PK], disease_id[FK], report_id[FK])
        - ReportSyndrome
        - ReportLocation    (id[PK], location_id[FK], report_id[FK])
        - Date              (id[PK], date, hour, minute)
        - Article           (id[PK], url, headline, date[FK])
        - Report            (id[PK], article_id[FK], location_id[FK], date_start_id[FK], date_finish_id[FK], report_disease_id[FK], report_syndrome_id[FK])
*/

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

-- UNIQUE location lookup table
-- create a new location when necessary
CREATE TABLE Location ( -- contains nullable values eg city, we may not be able to specify an exact city from the text?
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    --country VARCHAR(128) NOT NULL,
    --state VARCHAR(128), -- or province, region, etc
    --city VARCHAR(128), -- or town, village, etc
    geonames_id VARCHAR(255) -- reference to geonames ID public database, NOT a foreign key
)

-- Stores one of the locations of a particular report
-- There can be multiple ReportLocations of the same location (e.g. Sydney), but refer to a different report that coincidentally occured at the same place
CREATE TABLE ReportLocation ( 
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    location_id INTEGER, 
    report_id INTEGER FOREIGN KEY REFERENCES Report(id),
);


CREATE TABLE ReportDisease (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    disease_id INTEGER FOREIGN KEY REFERENCES Disease(id)
);

CREATE TABLE ReportSyndrome (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    syndrome_id INTEGER FOREIGN KEY REFERENCES Syndrome(id)
);

-- not unique, duplicate times may exist
CREATE TABLE Date (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,
    date DATE NOT NULL, -- since a date is compulsory, we can use the inbuilt datatype

    -- however, hour and minute might not be set so define these separately 
    hour INTEGER, -- Nullable
    minute INTEGER -- Nullable
);

CREATE TABLE Article (
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,

    url VARCHAR(512),
    headline VARCHAR(255),
    -- main_text VARCHAR(100000), -- 100 kb is a very large text file
    date_id INTEGER FOREIGN KEY REFERENCES Date(id)
);

CREATE TABLE Report ( 
    id INTEGER UNIQUE AUTO_INCREMENT NOT NULL PRIMARY KEY,

    article_id INTEGER FOREIGN KEY REFERENCES Article(id)
    report_location_id INTEGER FOREIGN KEY REFERENCES ReportLocation(id),

    date_start_id INTEGER NOT NULL FOREIGN KEY REFERENCES Date(id),
    date_finish_id INTEGER FOREIGN KEY REFERENCES Date(id) -- Nullable, incase report starts and finishes at the same time
    
    report_disease_id INTEGER FOREIGN KEY REFERENCES ReportDisease(id),
    report_syndrome_id INTEGER FOREIGN KEY REFERENCES ReportSyndrome(id)
);

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
