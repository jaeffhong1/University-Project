from modeltwo import session

if __name__ == "__main__":

    with session.OpenSession() as dbs:
        rep_3 = dbs.AddReport(6, '0000-0-0 00:00:00', '0000-0-0 01:00:00', ['chicago'], ['sars'], ['Meningitis'])
        #rep_1 = dbs.AddReport(6, '0000-0-0 01:00:00', '0000-0-0 02:00:00', ['sars'], [])
    

