from model import session, schemas

if __name__ == '__main__':
    with session.Connection() as dbs:
        print(dbs.ViewReports())
        
        
    
    
    