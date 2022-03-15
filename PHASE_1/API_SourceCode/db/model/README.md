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

my_new_disease_row = schemas.Disease(name='A new disease!!!!')
```

If you want to insert it into the database, you must be in a session:
```python
from model import session, schemas

with session.Connection() as dbs:
    my_new_disease_row = schemas.Disease(name = 'A new disease!!!!')
    dbs.add(my_new_disease_row) # add it to the database

# done!
```
Exiting the session automatically commits your changes. Disable this with: `session.Connection(commit_on_exit=False)`. Then, within the session use `dbs.commit()` to manually commit your changes.

### More complicated writing/inserting of rows with relationships
Often you will need to add an Article, which stores an id to an EventDate. Instead of manually creating an EventDate, then fetching its ID, you can set it by creating the EventDate object inside the article object. When the changes are committed, the EventDate will also be added.

## Example 1
```python
from model import session, schemas

with session.Connection() as dbs:
    article = schemas.Article(
        url = 'articles.com/articles/1.html',
        headline = 'My new article!',
        eventdate = schemas.EventDate(daydate='2022-03-13', 13, 2)
    )
        
    dbs.add(article)
```

### Example 2: Insert entire report with new Article
```python
from model import session, schemas

with session.Connection() as dbs:
    report = schemas.Report(
        article = schemas.Article(
            url = 'website.com', 
            headline = 'A report!',
            eventdate = schemas.EventDate(daydate='2020-03-13', hour=2, minute=6)  
        ),
        start_eventdate = schemas.EventDate(daydate='2020-03-02', hour=43, minute=12),
        finish_eventdate = schemas.EventDate(daydate='2020-03-05', hour=1, minute=59),
        reportlocations = [schemas.ReportLocation(geonames_id='123456')],
        diseases = dbs.get_diseases('monkeypox'),
        syndromes = dbs.get_syndromes('Meningitis')
    )
    
    dbs.add(report)
```
Notice the use of `dbs.get_diseases`. Use this to get all Disease objects by their name.

### Example 3: Inserting reports by IDs
```python
from model import session, schemas

with session.Connection() as dbs:

    article = schemas.Article(url='disease-articles.com/article/55', headline='Multiple Reports in This Article', schemas.EventDate(daydate='0000-00-00', hour=0, minute=0))

    print(article.id) # prints 'None', since we didn't assign one yet

    # we must add this article to the database
    # then it will be assigned an ID by MySQL which we can then fetch
    dbs.commit()

    # now its been added it has an ID that was automatically given by the database
    ARTICLE_ID = article.id

    report1 = schemas.Report(article_id=ARTICLE_ID, ...)
    report2 = schemas.Report(article_id=ARTICLE_ID, ...)
    report3 = schemas.Report(article_id=ARTICLE_ID, ...)
    
    dbs.add(report)
```

## Reading/selecting data from the database

### Example 1: Using ViewReports to get all report data
```python
from model import session

all_reports = []

with session.Connection() as dbs:
    all_reports = dbs.ViewReports()
```
ViewReports returns a dictionary with keys: 
* id
* geonames_id
* article_url
* article_headling
* article_daydate
* article_hour
* article_minute
* report_start_daydate
* report_start_hour
* report_start_minute
* report_finish_daydate
* report_finish_hour
* report_finish_minute
* diseases
* syndromes

This should be all the data you need. But for more control:

### Example 2: Fetching data in the form of Schemas
You can get data in the form of the Schemas which are pre-built (e.g. Article, Report, etc)
```python
from sqlalchemy import select
from model import session, schemas

with session.Connection() as dbs:
    # SELECT Reports.id, Reports.start_eventdate_id FROM Reports WHERE Reports.id = 2;
    query = select([schemas.Report.id, schemas.Report.start_eventdate_id]).where(schemas.Report.id == 2)

    result = dbs.execute(query)
```

From here you can actually change the values of reports and when you commit, these changes will be made on the db.

