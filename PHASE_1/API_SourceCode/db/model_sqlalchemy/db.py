import os
from dotenv import load_dotenv
from urllib.parse import quote_plus as urlquote # to encode the environment variables for url use in the event that a value contains special characters
from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String
#import mysql.connector
#from mysql.connector import Error as MySQLConnectionError # I dont like the ambiguous "Error"

# load database credentials from environement file
path_to_env: str = './'
load_dotenv(os.path.join(path_to_env, 'db.env'))

# retrieve database credentials as static values
hostname: str = os.environ['hostname']
port: str = os.environ['port']
username: str = os.environ['username']
password: str = urlquote(os.environ['password'])
database: str = os.environ['database']

# create the connection engine
engine = create_engine(f"mysql+mysqlconnector://{username}:{password}@{hostname}:{port}/{database}", echo=True, future=True)

metadata = MetaData() # bind=engine

DiseasesTable = Table(
    'Diseases',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String)
)

SyndromesTable = Table(
    'Syndromes',
    metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String)
)

print(DiseasesTable.select())

with engine.connect() as conn:
    #result = conn.execute(text("select * from ViewReport;"))
    #print(result.all())
    
    

    pass