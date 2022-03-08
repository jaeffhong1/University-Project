/*
 * SQL Database Build/Setup
 * WARNING: Running this will delete all database data
 * This will create the required tables with the correct structure for initialising the database.
*/

CREATE TABLE Location ( -- contains nullable values eg city, we may not be able to specify an exact city from the text?
    id INTEGER PRIMARY KEY,
    country VARCHAR(128) NOT NULL,
    state VARCHAR(128), -- or province, region, etc
    city VARCHAR(128), -- or town, village, etc
);

CREATE TABLE Time (
    id INTEGER PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    day INTEGER NOT NULL,
    hour INTEGER, -- can be null
    minute INTEGER
);

CREATE TABLE Article (
    id INTEGER PRIMARY KEY,
    url VARCHAR(512),
    headline VARCHAR(255),
    main_text VARCHAR(100000), -- 100 kb is a very large text file
    date_of_publication DATETIME -- unlike a report we can always scrape the exact date and time
);

CREATE TABLE Report ( -- "case"
    id INTEGER PRIMARY KEY,
    article_id INTEGER FOREIGN KEY REFERENCES Article(id)
    location_id INTEGER FOREIGN KEY REFERENCES Location(id),
    time_id INTEGER FOREIGN KEY REFERENCES Time(id),
    syndrome VARCHAR(128)
);

CREATE TABLE DiseaseCase (
    id INTEGER PRIMARY KEY,
    report_id FOREIGN KEY REFERENCES Report(id),
    name VARCHAR(128),
);

CREATE TABLE SyndromeCase ( -- do we need this?
    id INTEGER PRIMARY KEY,
    report_id FOREIGN KEY REFERENCES Report(id),
    name VARCHAR(128)
);