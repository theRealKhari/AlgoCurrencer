from flask import g
import mysql.connector
import pandas
from sqlalchemy import create_engine
import sqlalchemy
info = {'user':'root','pswd':'Toonlink1'}
user = info['user']
password = info['pswd']
engine = create_engine('mysql+mysqlconnector://'+user+':'+password+'@localhost:3306/counselDB', echo=False)

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

def get_test_data():
    g.cursor.execute("select prediction_json from test_data")
    data=g.cursor.fetchall() 
    return data

def get_table_data(table_name):
    g.cursor.execute("select * from "+table_name)
    return g.cursor.fetchall()

def get_table_chunk(table_name,chunk_size):
    g.cursor.execute("select * from "+table_name+" LIMIT "+chunk_size)
    return g.cursor.fetchall()

def get_ohlc_json():
    query = "SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'time_index', time_index, 'open', open, 'high', high, 'low', low, 'close', close, 'prediction', prediction)) from ohlc_data2"
    g.cursor.execute(query)
    return g.cursor.fetchall()

def get_all_currency_pairs():
    query = "select pair from active_currency_pairs"
    g.cursor.execute(query)
    return g.cursor.fetchall()

def get_all_active_intervals():
    query = "select name from active_intervals"
    g.cursor.execute(query)
    return g.cursor.fetchall()




def get_table_panda(table_name):
    with engine.connect() as conn, conn.begin():
        data = pandas.read_sql("select * from "+table_name,conn)
    return data

def get_latest_bar(table_name):
    with engine.connect() as conn, conn.begin():
        data = pandas.read_sql("select * from "+table_name,conn)
    return data.tail(1)
