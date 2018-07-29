import datetime
import pandas as pd
from pandas.io.json import json_normalize
import numpy as np
import json
import oandapyV20
from oandapyV20 import API
import oandapyV20.endpoints.pricing as pricing
import oandapyV20.endpoints.accounts as accounts
import oandapyV20.endpoints.instruments as instruments
import oandapyV20.endpoints.trades as trades
import oandapyV20.endpoints.orders as orders
import configparser
import time
import os

# Global Oanda Account Setup
config = configparser.ConfigParser()
config.read('C:\\Users\\Khari\\Documents\\Algo\\Resources\\config\\config.ini')
accTOKEN = config['oanda']['api_key']
accID = config['oanda']['account_id']
api = API(accTOKEN)
client = oandapyV20.API(accTOKEN)
a = accounts.AccountDetails(accID)

"""
So rather than calling the network everytime you want to make a calculation on something. maybe you have it call once at the beginning. So get currencybars will be updated at the start
of each iteration.

But for other data such as pricing. to make it more organize you will make a funciton called "get_currency_data" which will return the raw ouptut from the network.
Then make "parse_data" to sort through that data throughout the logic of the program. 

Do the samething with your account data. 
"""

#Get Data from oanda.
def get_currency_bars(ticker,granularity,numBars=1):
	"""
	returns a dataframe object that has the specified currency's Current price,Open,High,Low,Close Values
	for the specified Granularity. Default number of bars is 1. 
	"""
	#Set up Parameters
	inParams = {"count":numBars,
			  "granularity":granularity}
	#retrieve data from network
	candle_get = instruments.InstrumentsCandles(instrument=ticker,params=inParams)
	client.request(candle_get)
	#Flatten the data recived from network and set datetime index
	norm_data = json_normalize(candle_get.response['candles'])
	norm_data.set_index(norm_data['time'].apply(pd.to_datetime),inplace=True)
	#Create the dataframe you will return
	ret_df = pd.DataFrame(np.zeros((numBars,6)),index=norm_data['time'].apply(pd.to_datetime),columns='Open High Low Close Volume Complete'.split())
	#Assign corresponding Columns and return the dataframe!
	ret_df['Open'] = norm_data['mid.o']
	ret_df['High'] = norm_data['mid.h']
	ret_df['Low'] = norm_data['mid.l']
	ret_df['Close'] = norm_data['mid.c']
	ret_df['Volume'] = norm_data['volume']
	ret_df['Complete'] = norm_data['complete']
	
	return ret_df

def get_currency_info(ticker):
	"""
	Simple request that returns data on the specified currency. 
	"""
	inParams = {"instruments":ticker}
	pricing_get = pricing.PricingInfo(accountID=accID,params=inParams)
	api.request(pricing_get)
	return pricing_get.response

def get_account_data():
	"""
	Simple request that returns all data on the account. 
	"""
	client.request(a)
	return a.response

def parse_currency_info(what,input_info):
	"""
	Returns the specific piece of data from the currency info table passed in. 
	"""
	if what == "ask":
		return float(input_info['prices'][0]['asks'][0]['price'])
	elif what == "bid":
		return float(input_info['prices'][0]['bids'][0]['price'])
	elif what == "can_trade":
		return input_info['prices'][0]['tradeable']
	elif what == "units_available":
		return input_info['prices'][0]['unitsAvailable']['default']
	else:
		print('PLEASE ENTER A ACTUAL OPTION TO RETRIEVE DIMWIT')

def parse_account_data(what,input_info):
	"""
	Returns the specific peice of data from the acoount data table passed in. 
	"""
	if what == "balance":
		return float(input_info['account']['balance'])
	elif what == "margin_used":
		return float(input_info['account']['marginUsed'])
	elif what == "margin_available":
		return float(input_info['account']['marginAvailable'])
	elif what == "unrealized_pl":
		return float(input_info['account']['unrealizedPL'])
	elif what == "trades":
		return input_info['account']['trades']
	elif what == "orders":
		return input_info['account']['orders']
	else:
		print("CHOOSE A REAL OPTION MAN GEEZ")


#Order Management

def pending_order(instrument,type,price,units,stopLoss,takeProfit):
	"""
	Places a pending order at the price specified. Returns an order ID if successful.
	"""
	if type == "buy":
		pass
	elif type == "sell":
		units *= -1
	else:
		print("Choose only 'buy' or 'sell' please and thanks")
		return 0

	inParams = {"order":{"price":str(price),
						 "stopLossOnFill":{"timeInForce":"GTC",
						 				   "price":str(stopLoss)},
						 "takeProfitOnFill":{"timeInForce":"GTC",
						 					 "price":str(takeProfit)},
						 "timeInForce":"GTC",
						 "instrument":instrument,
						 "units":units,
						 "type":"MARKET_IF_TOUCHED",
						 "positionFill":"DEFAULT"}}

	order_post = orders.OrderCreate(accountID=accID,data=inParams)
	client.request(order_post)
	print("Entry Order placed on "+instrument+" for: "+str(price)+"---Units: "+str(units))
	return int(order_post.response['orderCreateTransaction']['id'])

def market_order(instrument,type,units,stopLoss,takeProfit):
	"""
	Places a market order at that time. returns order ID if successful
	"""
	if type == "buy":
		pass
	elif type == "sell":
		units *= -1
	else:
		print("Choose only 'buy' or 'sell'... please and thanks")
		return 0

	inParams = {"order":{"stopLossOnFill":{"timeInForce":"GTC",
						 				   "price":str(stopLoss)},
						 "takeProfitOnFill":{"timeInForce":"GTC",
						 					 "price":str(takeProfit)},
						 "timeInForce":"FOK",
						 "instrument":instrument,
						 "units":units,
						 "type":"MARKET",
						 "positionFill":"DEFAULT"}}

	order_post = orders.OrderCreate(accountID=accID,data=inParams)
	client.request(order_post)
	print("Market Order placed on "+instrument+"---Units: "+str(units))
	return int(order_post.response['orderCreateTransaction']['id'])
	

def cancel_pending_order(order_id):
	"""
	Cancels the selected pending order.
	"""
	order_cancel = (orders.OrderCancel(accountID=accID,orderID=order_id))
	client.request(order_cancel)
	return order_cancel.response


def close_position(trade_id,units=None):
	"""
	Closes the selected position.  
	"""
	if units:
		inParam = {"units": str(units)}
	else:
		inParam = None

	position_close = trades.TradeClose(accID,tradeID=trade_id,data=inParam)
	client.request(position_close)
	return position_close.response


#Event Based Functions. 
def event_new_tick(instrument):
	"""
	returns true if a new bar has formed since the last interval check. 
	"""
	inParam = {"instruments":instrument}


	price_stream = pricing.PricingStream(accountID=accID,params=inParam)
	client.request(price_stream)

	return price_stream.response

#Utility Functions. 

def pips(pipamount):
	return pipamount*0.0001


#Signal Functions.

def is_trade_on_currency(instrument):
	"""
	returns true if there is a open trade on the account for that currency already. 
	"""

def is_order_on_currency(instrument):
	"""
	returns true if there is 
	"""

def event_in_time_range(startTime,endTime):
	"""
	returns true if current time is within the range of the 2 datetime objects
	"""
	pass

def event_this_day(day):
	"""
	returns true if the current day is the day specified.('Monday', 'Tuesday', 'Wednesday'... etc)
	"""
	pass



def cross_over(arg1,arg2):
	"""
	Returns 1 if a crossover between the two arrays has occured on the current bar. -1 if the other way around. 0 if nothing changed (2 series objects passed in) (slow,fast)
	"""

	if arg1.iloc[-2] >= arg2.iloc[-2]:
		#slower value was previously above the faster value. When a cross occurs it will be a positive signal
		
		if arg1.iloc[-1] < arg2.iloc[-1]:
			#It did crossover!
			return 1
		else:
			return 0
	else:
		#slower value was previously below the faster value. When a cross occurs it will be a negative signal

		if arg1.iloc[-1] > arg2.iloc[-1]:
			#It did crossover!
			return -1
		else:
			return 0 
