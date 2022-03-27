import os
from dotenv import load_dotenv
from urllib.parse import (
    quote_plus as urlquote,
)  # to encode the environment variables for url use in the event that a value contains special characters
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session as SQLAlchemySession
from sqlalchemy.sql import text # create SQL text queries

# import mysql.connector # not needed for local import, but needed for sqlalchemy
# from mysql.connector import Error as MySQLConnectionError # I dont like the ambiguous "Error"

def GetDBCredentials() -> dict:
    """Retrieves database credentials and connection setting and returns them as a dict."""

    # load database credentials from environement file
    path_to_env: str = "./"
    load_dotenv(os.path.join(path_to_env, "db.env"))

    # TODO: catch file not found, return helpful error message

    # retrieve database credentials as static values
    return {
        "hostname": urlquote(os.environ["hostname"]),
        "port": urlquote(os.environ["port"]),
        "username": urlquote(os.environ["username"]),
        "password": urlquote(os.environ["password"]),
        "database": urlquote(os.environ["database"]),
    }

# "private static methods"
# this method is only needed by the UtilitySession class so declare outside but in the same file
def format_date_for_db(timedate) -> tuple:
    """Takes a string of format "YYYY-M-D HH:MM:SS" and converts it to a tuple of format ("YYYY-MM-DD", H, M), where H and M are integers but M can be None.

    Args:
        timedate (str): A time of format "YYYY-M-D HH:MM:SS". Month and day can be single digit.

    Returns:
        Tuple(str, int, int)
    """

    # if any of the following split operations fail (can't be split into exactly n pieces), then the input format was wrong
    try:
        # break the timedate in half (date and time respecivly)
        date, time = timedate.split(
            " "
        )  # there should be a space separating the two halves

        # extract the date data
        year, month, day = date.split(
            "-"
        )  # year, month and date should be separated by hyphen ('-')

        # extract the time data
        # ignore seconds
        hour, minute, _ = time.split(
            ":"
        )  # hour, minute and seconds should be separated by colon (':')

        # hour is a required value in the database
        hour_int = int(hour)
    except:
        raise ValueError(
            f'The format of parameter \'timedate\' was wrong. Expected value of format of "YYYY-M-D HH:MM:SS", but recieved "{timedate}".'
        )

    # minute is an optional field, give it None value if it can't be parsed to an int e.g. minute = 'xx'
    try:
        minute_int = int(minute)
    except:
        minute_int = None

    # format and return as tuple of three elements: datetime, hour, minute
    # pad month and day to 2 digits
    # padding requires integers, so convert daydate values to integers first
    return (f"{int(year):04}-{int(month):02}-{int(day):02}", hour_int, minute_int)

class UtilitySession(SQLAlchemySession):
    """Overrides the default sqlalchemy Session, but adds some extra utility methods."""
    
    # NOTE: Not SQL injection proof
    def GetReports(self, article_id=None, article_headline=None, article_url=None, geoname_ids=None, after_eventdate=None, before_eventdate=None):
        where = ''

        if article_id != None:
            where += f"article_id = {article_id} AND"
        if article_headline != None:
            where += f"article_headline = \"{article_headline}\""
        
        return self.execute(text("SELECT * FROM ViewReports;")).fetchall()

    def GetArticles(self):
        return self.execute(text("SELECT * FROM ViewArticles;")).fetchall()

    def AddArticle(self, url: str, headline: str, maintext: str, eventdate: str):

        daydate, hour, minute = format_date_for_db(eventdate)

        # insert the EventDate
        self.execute(text(f"INSERT INTO EventDates (daydate, hour, minute) VALUES (\"{daydate}\", {hour}, {minute});"))

        # get the id of the inserted EventDate
        eventdate_id = self.__get_last_inserted_id()

        # insert the article
        self.execute(text(f"INSERT INTO Articles (url, headline, maintext, eventdate_id) VALUES (\"{url}\", \"{headline}\", \"{maintext}\", {eventdate_id});"))
        return self.__get_last_inserted_id()

    def AddReport(self, article_id: int, start_eventdate: str, finish_eventdate: str, geoname_ids: list, diseases: list, syndromes: list) -> int:

        # validate geoname_ids list
        if type(diseases) != list:
            raise TypeError(f"Argument \"geoname_ids\" must be a list of ints but got a \"{type(diseases)}\".")
        elif len(diseases) > 0 and type(diseases[0]) != str:
            raise TypeError(f"Argument \"geoname_ids\" must be a list of ints but got a list of \"{type(geoname_ids[0])}\".")
            
        # validate the diseases and syndromes list
        if type(diseases) != list or (len(diseases) > 0 and type(diseases[0]) != str):
            raise TypeError(f"Argument \"diseases\" must be a list of strings but got a \"{type(diseases)}\".")
        elif type(syndromes) != list or (len(syndromes) > 0 and type(syndromes[0]) != str):
            raise TypeError(f"Argument \"syndromes\" must be a list of strings but got a \"{type(syndromes)}\".")

        disease_ids = self.__get_diseases(*diseases)
        syndrome_ids = self.__get_syndromes(*syndromes)

        # get the date strings into viable formats
        start_daydate, start_hour, start_minute = format_date_for_db(start_eventdate)
        finish_daydate, finish_hour, finish_minute = format_date_for_db(finish_eventdate)

        # insert the EventDates
        self.execute(text(f"INSERT INTO EventDates (daydate, hour, minute) VALUES (\"{start_daydate}\", {start_hour}, {start_minute});"))
        start_eventdate_id = self.__get_last_inserted_id()
        self.execute(text(f"INSERT INTO EventDates (daydate, hour, minute) VALUES (\"{finish_daydate}\", {finish_hour}, {finish_minute});"))
        finish_eventdate_id = self.__get_last_inserted_id()

        # insert the new report
        self.execute(text(f"INSERT INTO Reports (article_id, start_eventdate_id, finish_eventdate_id) VALUES ({article_id}, {start_eventdate_id}, {finish_eventdate_id});"))
        
        # return the id of the report just inserted
        report_id = self.__get_last_inserted_id()

        # now add the disease/syndrome reports
        for d in disease_ids:
            self.execute(text(f"INSERT INTO ReportDiseases (report_id, disease_id) VALUES ({report_id}, {d});"))
        for s in syndrome_ids:
            self.execute(text(f"INSERT INTO ReportSyndromes (report_id, syndrome_id) VALUES ({report_id}, {s});"))

        # add the locations
        for gid in geoname_ids:
            self.execute(text(f"INSERT INTO ReportLocations (geoname_id) VALUES ({gid});"))

    # private methods
    def __get_last_inserted_id(self) -> int:
        res = self.execute(text("SELECT LAST_INSERT_ID();")).fetchone() # get one row-tuple from the 1 row result
        return res[0] # extract the first (and only) value (column value) from the tuple result

    def __get_diseases(self, *args) -> list:
        ids: list = []
        for arg in args:
            res = self.execute(text(f"SELECT id FROM Diseases WHERE name = \"{arg}\";"))
            print(res)
            row = res.fetchone()
            ids.append(row[0]) # extract the first (and only) value (column value) from the tuple result
        return ids

    def __get_syndromes(self, *args):
        ids: list = []
        for arg in args:
            res = self.execute(text(f"SELECT id FROM Syndromes WHERE name = \"{arg}\";")).fetchone()
            ids.append(res[0]) # extract the first (and only) value (column value) from the tuple result
        return ids


# context manager for UtilitySession
class OpenSession:
    """Implements context manager. Use to run queries to db."""

    # create some private static values for use in creating a session
    _cred: dict = GetDBCredentials()
    _engine = create_engine(
        f"mysql+mysqlconnector://{_cred['username']}:{_cred['password']}@{_cred['hostname']}:{_cred['port']}/{_cred['database']}",
        echo=True,
        future=True,
    )
    _Session = sessionmaker(bind=_engine)  # gets a session CLASS, not object

    def __init__(self, commit_on_exit=True):
        """Implement context manager init"""
        self.commit_on_exit = commit_on_exit

    def __enter__(self):
        # create an object of type _Session()
        # _Session() is a "private" static member of this class
        self.session = OpenSession._Session()
        # convert the session to my custom session super class
        self.session.__class__ = UtilitySession
        #return self.session
        return self.session

    def __exit__(self, exc_type, exc_value, exc_traceback):
        # check if we should commit any changes automatically before we close
        # this allows users to ommit the commit call in their logic
        if self.commit_on_exit:
            self.session.commit()

        # close the connection
        self.session.close()

    


