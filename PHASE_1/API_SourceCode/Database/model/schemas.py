import datetime as dt

class EventDate:
    year: int
    month: int
    day: int
    hour: int
    minute: int
    
    def __init__(self, year: int, month: int, day: int, hour: int, minute: int = None):
        self.year = year #__validateYearInput(year)
        
    
     
    