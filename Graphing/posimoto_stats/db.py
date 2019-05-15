from flask import g
import mysql.connector
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="Toonlink1",
  database="counselDB"
)



def open_db_connection():
    g.cursor = mydb.cursor()
    print(g.cursor)

def close_db_connection():
    g.cursor.close()


