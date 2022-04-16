import mysql.connector
from mysql.connector import errorcode

mydb = None

try:
    mydb = mysql.connector.connect(
        host="172.105.183.203",
        user="seng3011",
        password="@piFethi3011",
        port=5231,
        auth_plugin='mysql_native_password'
    )

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
    exit('Yikes!')

print(mydb)

# Example

cursor = mydb.cursor()

query = """
SELECT a.name AS name, a.url AS url, a.root AS root, params, fields
FROM apis a
WHERE a.id = %s
JOIN has_params hp
ON a.id = hp.api
JOIN parameters p
ON hp.parameter = p.id
JOIN has_fields hf
ON a.id = hf.api
JOIN p
ON hf.field = p.id
JOIN types t
ON p.type = t.id
"""

cursor.execute(query)
result = cursor.fetchall()
for x in result:
    print(x)

cursor.close()

mydb.close()
