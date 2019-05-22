from flask import Flask, render_template, g, flash, redirect, url_for, session, request
from jinja2 import Environment, PackageLoader, select_autoescape
from datetime import *
import json
import db  # if error, right-click parent directory "mark directory as" "sources root"

app = Flask(__name__)
app.config['SECRET_KEY'] = 'SUPER SECRET SKELINGTON'

# Various Form classes

@app.before_request
def before_request():
    db.open_db_connection()


@app.teardown_request
def teardown_request(exception):
    db.close_db_connection()


@app.route('/', methods=['GET','POST'])
def index():
    currency = "EUR_USD"
    interval = "M5"
    dataT = "indicators"
    chunk_size= 90
    table_name = "ktrade_"+currency+"_"+interval+"_"+dataT
    #table_name = "ohlc_data2"
    panda_data = db.get_table_panda(table_name)
    graph_chunk = panda_data.tail(chunk_size)
    graph_chunk = graph_chunk.to_json(orient='records')
    return render_template('index.html', graph_chunk = graph_chunk, chunk_size=chunk_size,interval=interval,currency=currency,dataT=dataT)

@app.route('/council_results', methods=['GET','POST'])
def council_results():
    return render_template('council_results.html')

@app.context_processor
def test_debug():

    def console_log(input_1,  input_2 = '', input_3 = ''):
        print("logging", input_1)
        print(input_2)
        print(input_3)
        return input_1

    return dict(log=console_log)



# -------------------------------------------
if '__main__' == __name__:
    app.run(ssl_context=('cert.pem', 'key.pem'), host='0.0.0.0',debug=True)

