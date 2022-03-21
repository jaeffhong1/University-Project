from model import session
from sqlalchemy.sql import text # create SQL text queries

# "private static methods"
# this method is only needed by the Model class so declare outside but in the same file
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

def get_last_inserted_id(session: session.Connection._Session) -> int:
    res = dbs.execute(text("SELECT LAST_INSERT_ID();")).fetchone() # get one row-tuple from the 1 row result
    return res[0] # extract the first (and only) value (column value) from the tuple result


class Model:
    @staticmethod
    def GetReports():
        query = text("SELECT * FROM ViewReports;")
        results = []
        with session.Connection() as dbs:
            results = dbs.execute(viewreports).fetchall()
        return results

    @staticmethod
    def GetArticles():
        query = text("SELECT * FROM ViewArticles;")
        results = []
        with session.Connection() as dbs:
            results = dbs.execute(viewreports).fetchall()
        return results

    @staticmethod
    def AddArticle(url: str, headline: str, maintext: str, eventdate: str):
        article_id: ini = None 

        daydate, hour, minute = format_date_for_db(eventdate)

        with session.Connection() as dbs:

            # insert the EventDate
            dbs.execute(text(f"INSERT INTO EventDates (daydate, hour, minute) VALUES (\"{daydate}\", {hour}, {minute});"))

            # get the id of the inserted EventDate
            res = dbs.execute(text("SELECT LAST_INSERT_ID();")).fetchone()
            eventdate_id = res[0] # extract the first (and only) value from the tuple result
            print(type(eventdate_id))

            # insert the article
            dbs.execute(text(f"INSERT INTO Articles (url, headline, maintext, evendate_id) VALUES (\"{url}\", \"{headline}\", \"{maintext}\", {eventdate_id});"))
            return get_last_inserted_id(dbs)


if __name__ == "__main__":

    article_id = Model.AddArticle('website.com', 'new article thingo', 'main text here blah blah', '2020-04-12 13:32:xx')
    print(article_id)
    

