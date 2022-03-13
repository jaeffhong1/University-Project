from sqlalchemy import MetaData, Table, Column, Integer, String, Date, ForeignKey

metadata = MetaData() # bind=engine

Diseases = Table(
    'Diseases',
    metadata,
    Column('id', Integer, nullable=False, unique=True, autoincrement=True, primary_key=True),
    Column('name', String, nullable=False)
)

Syndromes = Table(
    'Syndromes',
    metadata,
    Column('id', Integer, nullable=False, unique=True, autoincrement=True, primary_key=True),
    Column('name', String, nullable=False)
)

EventDates = Table(
    'EventDates',
    metadata,
    Column('id', Integer, nullable=False, unique=True, autoincrement=True, primary_key=True),
    Column('daydate', Date, nullable=False),
    Column('hour', Integer, nullable=False),
    Column('minute', Integer)
)

Articles = Table(
    'Articles',
    metadata,
    Column('id', Integer, nullable=False, unique=True, autoincrement=True, primary_key=True),
    Column('url', String, nullable=False),
    Column('headline', String, nullable=False),
    Column('eventdate_id', ForeignKey('EventDates.id'), nullable=False)
)

Reports = Table(
    'Reports',
    metadata,
    Column('id', Integer, nullable=False, unique=True, autoincrement=True, primary_key=True),
    Column('article_id', ForeignKey)
)