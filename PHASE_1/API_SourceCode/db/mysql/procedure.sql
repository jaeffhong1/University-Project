-- ARTICLE CREATION
DROP PROCEDURE IF EXISTS NewArticle;
delimiter // -- replace delimeter for procedure crration
CREATE PROCEDURE NewArticle (
    IN new_url VARCHAR(255), 
    IN new_headline VARCHAR(255), 
    IN new_daydate DATE, 
    IN new_hour INT, 
    IN new_minute INT
)
BEGIN
    INSERT INTO EventDate (daydate, hour, minute) VALUES (new_daydate, new_hour, new_minute);

    INSERT INTO Article (url, headline, eventdate_id) VALUES (new_url, new_headline, LAST_INSERT_ID());

    SELECT LAST_INSERT_ID();
END//
delimiter ;

-- REPORT CREATION
DROP PROCEDURE IF EXISTS NewReport;
delimiter //
CREATE PROCEDURE NewReport (
    IN new_article_id INT, 
    IN new_start_daydate DATE, 
    IN new_start_hour INT,
    IN new_start_minute INT, 
    IN new_finish_daydate DATE,
    IN new_finish_hour INT, 
    IN new_finish_minute INT
)
BEGIN
    DECLARE startID INT;
    DECLARE finishID INT;

    -- add the start date
    INSERT INTO EventDate (daydate, hour, minute) VALUES (new_start_daydate, new_start_hour, new_start_minute);
    SET @startID = LAST_INSERT_ID();

    SELECT * FROM Article;

    -- add the finish date
    INSERT INTO EventDate (daydate, hour, minute) VALUES (new_finish_daydate, new_finish_hour, new_finish_minute);
    SET @finishID = LAST_INSERT_ID();

    SELECT * FROM Article;

    -- finally, add the report
    INSERT INTO Report (article_id, start_eventdate_id, finish_eventdate_id) VALUES (new_article_id, startID, finishID);

    -- allow the last insert id to be selected and printed
    SELECT LAST_INSERT_ID();
END//
delimiter ;