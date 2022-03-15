import os
from dotenv import load_dotenv
from urllib.parse import (
    quote_plus as urlquote,
)  # to encode the environment variables for url use in the event that a value contains special characters
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .utils import UtilitySession

# import mysql.connector
# from mysql.connector import Error as MySQLConnectionError # I dont like the ambiguous "Error"


def GetDBCredentials() -> dict:
    """Retrieves database credentials and connection setting and returns them as a dict."""

    # load database credentials from environement file
    path_to_env: str = "./"
    load_dotenv(os.path.join(path_to_env, "db.env"))

    # retrieve database credentials as static values
    return {
        "hostname": urlquote(os.environ["hostname"]),
        "port": urlquote(os.environ["port"]),
        "username": urlquote(os.environ["username"]),
        "password": urlquote(os.environ["password"]),
        "database": urlquote(os.environ["database"]),
    }


class Connection:
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
        self.session = Connection._Session()
        # convert the session to a utility class
        self.session.__class__ = UtilitySession
        return self.session

    def __exit__(self, exc_type, exc_value, exc_traceback):
        # check if we should commit any changes automatically before we close
        # this allows users to ommit the commit call in their logic
        if self.commit_on_exit:
            self.session.commit()

        # close the connection
        self.session.close()
