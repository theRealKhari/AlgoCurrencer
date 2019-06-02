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
    currency_pairs = []
    currency_data = db.get_all_currency_pairs()
    for x in currency_data:
        currency_pairs.append(x[0])

    interval_options =[]
    interval_data =db.get_all_active_intervals()
    for x in interval_data:
        interval_options.append(x[0])

    indicator_list = []

    data_types = ['indicators','ohlc']
    currency = "EUR_USD"
    interval = "M5"
    dataT = "indicators"
    chunk_size= 50
    table_name = "ktrade_"+currency+"_"+interval+"_"+dataT
    #table_name = "ohlc_data2"
    panda_data = db.get_table_panda(table_name)

    # Extract Indicator names
    # Remember to add any prediction or other signals to the exception list
    for col in panda_data.columns:
        if col not in ['index','time','High','Low','Open','Close','Complete','log_returns']:
            indicator_list.append(col)

    graph_chunk = panda_data.tail(chunk_size)
    graph_chunk = graph_chunk.to_json(orient='records')
    return render_template('index.html', graph_data=graph_chunk, chunk_size=chunk_size,interval=interval,currency=currency,dataT=dataT, currency_pairs=currency_pairs, intervals=interval_options, types=data_types, indicator_list = indicator_list)

@app.route('/council_results', methods=['GET','POST'])
def council_results():
    return render_template('council_results.html')

@app.route('/algo_benchmark', methods=['GET','POST'])
def algo_benchmark():
    modes = [{'name': 'All Trades', 'value':'allTrades'},
                {'name': 'Correct Trades', 'value':'correctTrades'},
                {'name': 'Both', 'value':'bothTrades'}]
    return render_template('algo_benchmark.html',modes= modes)

@app.route('/get_data/<currency>/<interval>/<dataT>/<num_bars>', methods=['GET','POST'])
def get_data(currency,interval,dataT,num_bars):
        table_name = "ktrade_"+currency+"_"+interval+"_"+dataT
        data = db.get_table_panda(table_name)
        num_bars = int(num_bars)
        
        graph_chunk = data.tail(int(num_bars))
        graph_chunk = graph_chunk.to_json(orient='records')
        return graph_chunk

@app.route('/get_latest_bar/<currency>/<interval>/<dataT>/<lastID>', methods=['GET','POST'])
def get_latest_bar(currency,interval,dataT,lastID):
        table_name = "ktrade_"+currency+"_"+interval+"_"+dataT
        result = db.get_latest_bar(table_name)
        currID = result['index'].values[0]
        if int(currID) == int(lastID):
            print("UPDATE")
            return result.to_json(orient='records')
        else:
            print("append")
            latest_bar = result.to_json(orient='records')
            return latest_bar


@app.route('/get_benchmark_results/<algoName>', methods=['GET','POST'])
def get_benchmark_results(algoName):
    #TODO: update table name to be dynamic depending on the @param: name
    table_name="gg_benchmark_results"
    data = db.get_table_panda(table_name)
    benchmark_results =data.to_json(orient='records')
    return benchmark_results
    
@app.route('/get_benchmark_answers/<algoName>', methods=['GET','POST'])
def get_benchmark_answers(name):
    #TODO: update table name to be dynamic depending on the @param: name
    table_name="gg_timeline_answers"
    data = db.get_table_panda(table_name)
    benchmark_answers =data.to_json(orient='records')
    return benchmark_answers


@app.context_processor
def test_debug():

    def console_log(input_1,  input_2 = '', input_3 = ''):
        print("logging", input_1)
        print(input_2)
        print(input_3)
        return input_1
    
    def get_new_data(currency,interval,dataT,num_bars):
        table_name = "ktrade_"+currency+"_"+interval+"_"+dataT
        data = db.get_table_panda(table_name)
        print("Getting new data",currency,interval,dataT,num_bars)
        num_bars = 10
        graph_chunk = data.tail(num_bars)
        graph_chunk = graph_chunk.to_json(orient='records')
        return graph_chunk


    return dict(log=console_log, get_data=get_new_data)



# -------------------------------------------
if '__main__' == __name__:
     app.run(ssl_context=('cert.pem', 'key.pem'), host='0.0.0.0',port=5000, debug=True)

