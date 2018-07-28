
# coding: utf-8

# Imports galore

# In[1]:


import pandas as pd
import oandapyV20
from oandapyV20 import API
import sys
sys.path.append('C:\\Users\\Khari\\Documents\\Algo\\Resources')
import khariTrader as ktrade
import importlib as imp
import numpy as np
import datetime
import matplotlib.pyplot as plt
import time


# In[2]:


import talib


# In[3]:


imp.reload(ktrade)


# Setup Overall Algo Variables. 

# In[4]:


PAIR = 'EUR_USD' #Pair that this algorithm will trade on. 
TSIZE = 1000 #Number of units bought/sold per trade
GRAN = "M5" #Granularity of bars being checked. 
SL = ktrade.pips(4)
TP = ktrade.pips(7)


# In[5]:


print('hi')


# In[18]:


round(1.16278 + TP,4)


# Create tick feed

# In[6]:


TICK_FEED = ktrade.event_new_tick(PAIR)


# In[7]:



print("is this feed correct?")


# MAIN ALGORITHM CODE

# In[10]:



def Moving_Average_Cross_Algo():
    #A few initializations. 
    print('Code starting!')
    trades_placed = 0
    oldBar = None
    open_trade = None
    Checks = 0
    #Start feeding in ticks
    while True:
        print('Waiting 15 secs before checking bar')
        time.sleep(15)
        print('15 secs are up!')
        Checks += 1
        print ('check #{}'.format(Checks))

        #Some ticks are 'heartbeats' those are useless. 
        #if tick['type'] == 'PRICE':
        if True:

            #This bar is only used to check the timestamp to see if there is a new bar on this tick. "name is a timestamp"
            currBar = ktrade.get_currency_bars(PAIR,GRAN,1).iloc[-1].name

            #Checking to see if this bar has the same timestamp as the last bar
            if currBar == oldBar:
                print('tick', end=' ')
            else:
                print("\n NEW BAR DETECTED...")

                #Setting old bar as current bar for future checks
                oldBar = currBar

                #Get important data NETWORK
                accData = ktrade.get_account_data()
                time.sleep(1)
                instrumentData = ktrade.get_currency_info(PAIR)
                time.sleep(1)


                print("is there an open trade? i found: {}".format(open_trade))

                #Check to see if theres a trade on the currency
                if ktrade.parse_account_data('trades',accData) != []:
                    print("Trade already opened on currency, doing nothing")
                    continue



                #Get dataframe of currency bars NETWORK
                bData = ktrade.get_currency_bars(PAIR,GRAN,30)

                #Get current prices:
                askPrice = ktrade.parse_currency_info('ask',instrumentData)
                bidPrice = ktrade.parse_currency_info('bid',instrumentData)

                print('Ask price is: {}'.format(askPrice))

                #Create Indicators
                slow_ma = talib.MA(bData['Close'],1)
                fast_ma = talib.MA(bData['Close'],3)
                signal_ma = talib.MA(bData['Close'],5)



                #----TRADE LOGIC-----

                #check for moving average crossover.
                print(ktrade.cross_over(slow_ma,fast_ma))
                if ktrade.cross_over(slow_ma,fast_ma) == 1 and askPrice > signal_ma.iloc[-1]:
                    print('BUY SIGNAL OH YEAH')
                    
                    takeProf = round(askPrice + TP,4)
                    stopLoss = round(askPrice - SL,4)
                    
                    open_trade = ktrade.market_order(PAIR,'buy',TSIZE,stopLoss,takeProf)

                elif ktrade.cross_over(slow_ma,fast_ma) == -1 and bidPrice < signal_ma.iloc[-1]:
                    print('DETECTED A SELL SIGNAL')
                    
                    takeProf = round(bidPrice - TP,4)
                    stopLoss = round(bidPrice + SL,4)
                    
                    open_trade = ktrade.market_order(PAIR,'sell',TSIZE,stopLoss,takeProf)
                else:
                    print('No trade signal detected yet')
                    continue







# In[11]:


Moving_Average_Cross_Algo()

