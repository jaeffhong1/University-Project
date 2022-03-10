import os
import mysql.connector
from mysql.connector import Error as MySQLConnectionError # i dont like the ambiguous "Error"
from dotenv import load_dotenv
from typing_extensions import TypeAlias

# create some datatype aliases for readability
MySQLConnection: TypeAlias = mysql.connector.connection_cext.CMySQLConnection

# load database credentials
path_to_env: str = './'
load_dotenv(os.path.join(path_to_env, 'db.env'))

class DBConnection:
    """A DBConnection handles the connection authorisation and the possesion of the mysql.connector connection object. DBConnection does NOT manage interaction with the databases."""
    
    # retrieve database credentials as static values
    hostname: str = os.environ['hostname']
    port: int = os.environ['port']
    username: str = os.environ['username']
    password: str = os.environ['password']
    database: str = os.environ['database']
    
    connection: MySQLConnection
    
    # implement the init method for context management
    def __init__(self):
        pass
    
    # implement the enter method for context management
    def __enter__(self):
        self.connection = None
        try:
            self.connection = mysql.connector.connect(
                host=self.hostname,
                port=self.port,
                user=self.username,
                passwd=self.password,
                database=self.database
            )
            print(type(self.connection))
            print("MySQL Database connection successful")
            
            return self.connection
        except MySQLConnectionError as err:
            print(f"Error: '{err}'")
            return None
    
    # implement the exit method for context management
    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.connection.close()

class Model:
    """A Model takes a mysql.connection object and provides methods to interact with the database."""
    connection: MySQLConnection
    
    def __init__(self, connection):
        self.connection = connection
        
    def InsertArticle(self, url, headline, year, month, day, hour, minute=None):
        daydate = f"{year}-{"
        self.conection.cmd_query(f"INSERT INTO EventDate (daydate, hour, minute)")
        self.connection.cmd_query(f"INSERT INTO Article (url, headline")
    

# test the connector
if __name__ == '__main__':
    with DBConnection() as dbc:
        
        # get a model representation
        model = Model(dbc)