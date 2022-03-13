from re import S
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.sql import select
from .schemas import Disease, Syndrome
class UtilitySession(Session):
    """Overrides the default sqlalchemy Session, but adds some extra utility methods."""
    
    # override commit to prevent duplicates
    def commit(self):
        """Will remove any duplicate objects, then call the regular commit"""
        
        print(self.new)
        
        # self new contains a list of all new objects to be created on next commit
        # loop through each, ensure it is not a duplicate and delete if so
        for model in self.new:
        
            # get the type of the model e.g. Disease, Report
            mtype = model.__class__
            
            # produce the query: look for matching id
            query = select(mtype.id).where(mtype.id == model.id)

            # we must execute on the connection, not the session. Otherwise sqlalchemy executes all queries yet to be made
            result = self.connection().execute(query)
            
            # since the result is an iterator (non indexable), simply call next to see if it gets at least one result
            if next(result, None) != None:
                # we found at least one match, delete the object and prevent the duplicate from being inserted
                self.expunge(model)
    
        # now call super commit 
        super().commit()
        
    # define some utility methods
    def get_disease(self, disease_name: str):
        
        # build the query
        disease_id_query = select(Disease.id).where(Disease.name == disease_name)
        
        # execute the query
        disease_ids = self.execute(disease_id_query)
        
        try:
            id_tuple: tuple = disease_ids.__next__() # we only want the first result so just call next once (and we cant index it if u were wondering..)
            id: int = id_tuple[0] # get just the id section of the tuple
            
            return Disease(id=id, name=disease_name)
        except StopIteration:
            raise ValueError(f"A disease with the name '{disease_name}' couldn't be found in the database.")
        
    def get_diseases(self, *args):
        return [self.get_disease(name) for name in args]
    
    def get_syndrome(self, syndrome_name: str):
        syndrome_id_query = select(Syndrome.id).where(Syndrome.name == syndrome_name)
        ids = self.execute(syndrome_id_query)
        
        try:
            id_tuple: tuple = ids.__next__() # we only want the first result so just call next once (and we cant index it if u were wondering..)
            id: int = id_tuple[0] # get just the id section of the tuple
            
            s = Syndrome(id=id, name=syndrome_name)
            return s
        except StopIteration:
            raise ValueError(f"A syndrome with the name '{syndrome_name}' couldn't be found in the database.")
        
    def get_syndromes(self, *args):
        return [self.get_syndrome(name) for name in args]
        
        