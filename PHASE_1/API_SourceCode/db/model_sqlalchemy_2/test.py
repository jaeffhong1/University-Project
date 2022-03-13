from model import session, schemas

if __name__ == '__main__':
    with session.Connection() as dbs:
        
        report = schemas.Report(
            article = schemas.Article(
                url = '500.com', 
                headline = '500',
                eventdate = schemas.EventDate(daydate='0007-03-13', hour=2, minute=6)  
            ),
            start_eventdate = schemas.EventDate(daydate='0007-03-02', hour=43, minute=12),
            finish_eventdate = schemas.EventDate(daydate='0007-03-05', hour=1, minute=59),
            reportlocations = [schemas.ReportLocation(geonames_id='500')],
            diseases = dbs.get_diseases('monkeypox'),
            syndromes = dbs.get_syndromes('Meningitis')
        )
        
        dbs.add(report)
        
        
    
    
    