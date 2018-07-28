import dash
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html

import pandas as pd
import oandapyV20
from oandapyV20 import API
import sys
sys.path.append('C:\\Users\\Khari\\Documents\\Algo\\Resources')
import khariTrader as ktrade





#Set up Pandas Bar Graph
bData = ktrade.get_currency_bars("EUR_USD","H1",30)



app = dash.Dash()

app.layout = html.Div(children=[

    html.Div(children='''
        EUR_USD
    '''),

    dcc.Graph(
        id='example-graph',
        figure={
            'data': [
                {'x': bData.index, 'y': bData['Close'], 'type': 'line', 'name': 'EUR USD'},
            ],
            'layout': {
                'title': 'EUR USD'
            }
        }
    )
])



print(bData.head())

if __name__ == '__main__':
	app.run_server(debug=True)