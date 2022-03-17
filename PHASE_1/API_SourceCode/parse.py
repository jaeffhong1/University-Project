"""
    Nick's Changes:
        - removed db parameter from insert_article and remove_all_articles_and_reports
        - added methods: format_date_for_db 
        - moved global code to main
"""

import json
from report_parser import parse_article
from db.model import session, schemas



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
    except:
        raise ValueError(
            f'The format of parameter \'timedate\' was wrong. Expected value of format of "YYYY-M-D HH:MM:SS", but recieved "{timedate}".'
        )
    try:
        hour_int = int(hour)
    except ValueError:
        hour_int = 0

    # minute is an optional field, give it None value if it can't be parsed to an int e.g. minute = 'xx'
    try:
        minute_int = int(minute)
    except:
        minute_int = None

    year = int(year)
    month = int(month)
    day = int(day)

    # format and return as tuple of three elements: datetime, hour, minute
    # pad month and day to 2 digits
    return (f"{year:04}-{month:02}-{day:02}", hour_int, minute_int)


def remove_all_articles_and_reports():
    with session.Connection() as dbs:
        pass


def insert_article(article: dict) -> int:
    """Inserts article dictionary into the database. Returns the ID of the article in database.

    Args:
        article (Dict[str, str]): A dictionary of article data to be inserted into the dataase. Must have keys: 'url', 'date_of_publication', 'headline'

    Returns:
        int: The ID of the article we inserted.
    """

    # dict['date_of_publication'] needs to be separated into daydate, hour minute values for db insertion
    daydate, hour, minute = format_date_for_db(article["date_of_publication"])

    # format_date_for_db can return None for value 'minute'. Since articles have no optional parameters, throw error in this case.
    if minute == None:
        minute = 0


    if minute == None:
        raise ValueError(
            f"Dictionary parameter 'article' contains insufficient datetime information in key 'date_of_publication' for insertion in Articles table. Ensure the 'date_of_publication' contains valid 'minute' data."
        )

    # store the id of the article we created
    article_id: int = -1

    # set commit_on_exit to false, since we will commit manually to retrieve new article id
    with session.Connection(commit_on_exit=False) as dbs:

        # create an article according to db schema
        new_article = schemas.Article(
            url=article["url"],
            headline=article["headline"],
            eventdate=schemas.EventDate(daydate=daydate, hour=hour, minute=minute),
        )

        # add the article to the operations to be made on commit
        dbs.add(new_article)

        # commit the changes
        dbs.commit()

        # now we can retrieve the id of the article we inserted that was automatically assigned by MySQL
        article_id = new_article.id

    # now we can return article_id after closed db session
    return article_id


def insert_reports(article_id: int, reports: list) -> None:
    """Insert multiple reports into the database all belonging to an Article of id 'article_id'.

    Args:
        article_id (int): The ID of the article each report belongs to. Will be used as the foreign key in each report.
        reports (List[Dict[str]]): A list of report dictionaries. Each dictionary represents the report to be inserted into the database. Must have keys "diseases", "syndromes", "event_date", "locations".
    """

    with session.Connection() as dbs:
        for report in reports:

            # dict['date_of_publication'] needs to be separated into daydate, hour minute values for db insertion
            daydate, hour, minute = format_date_for_db(article["date_of_publication"])

            r = schemas.Report(
                article_id=article_id,
                start_eventdate=schemas.EventDate(
                    daydate=daydate, hour=hour, minute=minute
                ),
                finish_eventdate=schemas.EventDate(
                    daydate=daydate, hour=hour, minute=minute
                ),  # for now assume same end date
                diseases=dbs.get_diseases(*report['diseases']),  # split list into args
                syndromes=dbs.get_syndromes(*report['syndromes']),  # split list into args
            )

            dbs.add(r)


if __name__ == "__main__":
    import sys
    posts_file = sys.argv[1]
    counts_file = sys.argv[2]

    if 'posts' in counts_file:
        print("usage: python3 parse.py <posts_file> <counts_file>")
        sys.exit(1)

    try:
        with open(counts_file) as fp:
            skip = int(next(fp))
    except FileNotFoundError:
        skip = 0


    with open(posts_file) as fp:
        # skip already processed lines
        for i in range(skip):
            next(fp)

        for line in fp:

            print(repr(line))
            # exstracts all article data including body
            article = json.loads(line)

            # will insert only url, headline, date, NOT html body
            article_id = insert_article(article)

            # insert all reports at once to avoid constant opening and closing of db connection causing network overload
            reports = parse_article(article)
            insert_reports(article_id, reports)

            skip += 1

    with open(counts_file, 'w') as fp:
        fp.write(skip)