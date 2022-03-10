import json
from typing import List # for type hinting

def read_name_json(filename: str) -> List[str]:
      
    # read the json content
    with open(filename, 'r') as file:
        
        # read the entire contents
        file_content = file.read()
        
        # read the json into an object
        dict_list = json.loads(file_content)
        
    # convert each dictionary to just the value
    names = []
    for d in dict_list:
        names += [d["name"]]
        
    return names
       
# now generate SQL INSERT queries 
# output to file
with open('./generated_queries.txt', 'a') as outf:
    
    # generate disease queries
    for did, disease in enumerate(read_name_json('./disease_list.json')):
        # append the query
        outf.write(f"INSERT INTO Disease (id, name) VALUES ({did+1}, \"{disease}\");\n")
        
    # generate syndrome queries
    for sid, syndrome in enumerate(read_name_json('./syndrome_list.json')):
        # append the query
        outf.write(f"INSERT INTO Syndrome (id, name) VALUES ({sid+1}, \"{syndrome}\");\n")


    
        