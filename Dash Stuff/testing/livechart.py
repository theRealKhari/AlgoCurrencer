import dash
from dash.dependencies import Output, Event
import dash_core_components as dcc
import dash_html_components as html
import plotly
import random
import plotly.graph_objs as go
from collections import deque

x = deque(maxlen=20)
y = deque(maxlen=20)
x.append(1)
y.append(1)


app = dash.Dash(__name__)
app.layout = html.Div([

	dcc.Graph(id='live-graph', animate=True),
	dcc.Interval(
		id='graph-update',
		interval=1000
		)

	])


#Here you are Making the function that returns a dictonary with your latest value. 
@app.callback(Output('live-graph','figure'),
			  events = [Event('graph-update','interval')])
def update_graph():
	x.append(x[-1]+1)
	y.append(x[-1]+(y[-1]*random.uniform(-0.1,0.1)))

	data = go.Scatter(
		x = list(x),
		y = list(y),
		name='Scatter',
		mode='lines+markers'
		)
	return {'data':[data], 'layout': go.Layout(xaxis = dict(range=[min(x),max(x)]),
											   yaxis = dict(range=[min(x),max(y)]))}


if __name__ == "__main__":
	app.run_server(debug=True)