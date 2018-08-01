guaranteedStopLossOrderMode                                             DISABLED
id                                                           101-001-5325021-002
createdTime                                       2017-02-25T02:41:57.999376190Z
currency                                                                     USD
createdByUserID                                                          5325021
alias                                                                 CrossBreak
marginRate                                                                  0.02
hedgingEnabled                                                             False
lastTransactionID                                                            560
balance                                                                9960.1490
openTradeCount                                                                 1
openPositionCount                                                              1
pendingOrderCount                                                              3
pl                                                                    -3392.1001
resettablePL                                                          -3392.1001
resettablePLTime                                  2017-02-25T02:41:57.999376190Z
financing                                                               -56.6909
commission                                                                0.0000
guaranteedExecutionFees                                                   0.0000
orders                         [{'id': '558', 'createTime': '2018-08-01T14:58...
positions                      [{'instrument': 'EUR_USD', 'long': {'units': '...
trades                         [{'id': '557', 'instrument': 'NZD_USD', 'price...
unrealizedPL                                                              0.0000
NAV                                                                    9960.1490
marginUsed                                                             1019.9100
marginAvailable                                                        8940.2390
positionValue                                                         33997.0000
marginCloseoutUnrealizedPL                                                4.0000
marginCloseoutNAV                                                      9964.1490
marginCloseoutMarginUsed                                               1019.9100
marginCloseoutPositionValue                                           33997.0000
marginCloseoutPercent                                                    0.05118
withdrawalLimit                                                        8940.2390
marginCallMarginUsed                                                   1019.9100
marginCallPercent                                                        0.10236
dtype: object









This is the data neatly layed out. The important Data is:


alias <----- This one is just the name of the account
balance
positionValue
openTradeCount  ----- Open trades that are in progress. 
pendingOrderCount  --------- Orders that have been placed but not activated yet. 
marginUsed
marginAvailable



the open orders is also important. within that category is:

Hopefully thats readable enoguh to figure out what you think is most important to use. 
 
 Notice that this is technically 1 order. the order with ID '560' is the main MARKET_IF_TOUCHED order. (buy/sell when price its that point) 
 
 Do with this info as you please. Im not sure how to associate the take profit and stoploss with the initial lorder. they both have the same trade ID though so they could at least be paired together idk. just thinking alloudd. 

under 'orders'

[{'id': '558',
  'createTime': '2018-08-01T14:58:05.984609623Z',
  'type': 'TAKE_PROFIT',
  'tradeID': '557',
  'price': '0.68111',
  'timeInForce': 'GTC',
  'triggerCondition': 'DEFAULT',
  'state': 'PENDING'},
 {'id': '559',
  'createTime': '2018-08-01T14:58:05.984609623Z',
  'type': 'STOP_LOSS',
  'tradeID': '557',
  'price': '0.67945',
  'guaranteed': False,
  'timeInForce': 'GTC',
  'triggerCondition': 'DEFAULT',
  'state': 'PENDING'},
 {'id': '560',
  'createTime': '2018-08-01T14:59:23.024989423Z',
  'type': 'MARKET_IF_TOUCHED',
  'instrument': 'EUR_USD',
  'units': '-62000',
  'timeInForce': 'GTD',
  'takeProfitOnFill': {'price': '1.16880', 'timeInForce': 'GTC'},
  'stopLossOnFill': {'price': '1.17160', 'timeInForce': 'GTC'},
  'price': '1.17043',
  'gtdTime': '2018-08-31T14:59:21.191000000Z',
  'triggerCondition': 'DEFAULT',
  'partialFill': 'DEFAULT_FILL',
  'positionFill': 'DEFAULT',
  'state': 'PENDING'}]
  
  
  here is what it looks like under 'trades'
  
  [{'id': '557',
  'instrument': 'NZD_USD',
  'price': '0.67986',
  'openTime': '2018-08-01T14:58:05.984609623Z',
  'initialUnits': '50000',
  'initialMarginRequired': '1019.6700',
  'state': 'OPEN',
  'currentUnits': '50000',
  'realizedPL': '0.0000',
  'financing': '0.0000',
  'takeProfitOrderID': '558',
  'stopLossOrderID': '559',
  'unrealizedPL': '0.0000',
  'marginUsed': '1019.9100'}]
  
  Same idea except that this trade is activly open on the market. and those values unrealized/realizedPL are important (basically if trade is in the negative or positive) the initaial margin and initial units are good to oknow. (1 unit is 1 dollar)
  margin used is also good to know. 
  
  
  
  Idk here is my overal summary. but you do you own thing if you want! i 






