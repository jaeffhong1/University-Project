# How to use Model Module

## Basic setup and usage
* There must be a `db.env` file next to your main application start point (e.g. app.py, main.py, etc). It must have entries hostname, port, username, password and database.
* To initiate a connection session to the db use
    ```python
    from model import session
    with session.Connection() as dbs:
        # read/write data to db here
    ```
* NOTE: All Dates must be a string and in the format 'YYYY-MM-DD'. Also, hour is an integer representing 24 hour time.

## Writing/inserting to database
### Simple writing/inserting of single row
To make changes to a particular table, you must import from model.schemas the object you would like to create.
Create a new row of a particular table like so:
```python
from model import schemas 

my_new_disease_row = schemas.Disease(name = 'A new disease!!!!')
```

If you want to insert it into the database, you must be in a session:
```python
from model import session, schemas

with session.Connection() as dbs:
    my_new_disease_row = schemas.Disease(name = 'A new disease!!!!')
    dbs.add(my_new_disease_row) # add it to the database

# done!
```
Exiting the session automatically commits your additions. Disable this with: `session.Connection(commit_on_exit=False)`. Then, within the session use `dbs.commit()` to manually commit your changes.

### More complicated writing/inserting of rows with relationships
Often you will need to add an Article, which stores an id to an EventDate. Instead of manually creating an EventDate, then fetching its ID, you can set it like this:
```python
with session.Connection() as dbs:
        
    article = Article(
        url = 'articles.com/articles/1.html',
        headline = 'My new article!',

    )
        
    dbs.add(article)
```
