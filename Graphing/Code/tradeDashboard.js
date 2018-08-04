'use strict';
///// CHARTING STUFF HEREE-----------___-
//yea
//
//
//
//
//
var _Chart1Data = [];
var _Chart1Times = [];
var _Chart2Data = [];
var _Chart2Times = [];
var _Chart3Data = [];
var _Chart3Times = [];
var _Chart4Data = [];
var _Chart4Times = [];

// Color setup
window.chart1Colors = [
	'rgb(255, 99, 132)',
	'rgb(255, 159, 64)',
	'rgb(255, 205, 86)',
	'rgb(75, 192, 192)',
	'rgb(54, 162, 235)',
	'rgb(153, 102, 255)',
	'rgb(201, 203, 207)'
];
window.pieColors = [
	'rgb(255, 99, 132)',
	'rgb(255, 159, 64)',
	'rgb(255, 205, 86)',
	'rgb(75, 192, 192)',
	'rgb(54, 162, 235)',
	'rgb(153, 102, 255)',
	'rgb(201, 203, 207)'
]


window.chart2Colors = [
	'rgb(255, 99, 132)',
	'rgb(255, 159, 64)',
	'rgb(255, 205, 86)',
	'rgb(75, 192, 192)',
	'rgb(54, 162, 235)',
	'rgb(153, 102, 255)',
	'rgb(201, 203, 207)'
];
/*
window.chart2Colors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
};

*/

var _TimeFormat = 'MM/DD/YYYY h:mm A';
var _MomentFormat = 'YYYY-MM-DD HH:mm:ss';

window.onload = function() {
	console.log("loadingData");
	getData();
}
function getData(){
	var ajax = new XMLHttpRequest();
	ajax.addEventListener("load", function () {
		printData(this.response);
	});
	ajax.open("POST", "./getData.php");
	ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var funct = "Nothing";
	ajax.send("funct="+funct);
}



function printData(data){
	console.log("Got data");
	//console.log(data);
	var jsonData = JSON.parse(data);
	//console.log(jsonData);
	createGraphs(jsonData);
}

function createGraphs(data){
	console.log("parsing Data",data);
	//console.log(data.Close);
	//console.log(data.Close,data.Close.length,data.Close[0])
	// parse data here and determine where they will go on their respective graphs
	//
	
	setupChart1(data);
	//setupChart2(data);
}

function setupChart1(data){
	var ohlcData = [];
	var tradeData = [];
	var openData = [];
	var highData = [];
	var lowData = [];
	var closeData = [];

	var dataTimeline = [];
	for ( var index in data.Close ) { // Basically use index as an index to access any part of the object
		//Timeline setup
		let timeStamp = String(new Date(Number(index)).toISOString()).split('.',5)[0];
		let newMoment = moment(timeStamp);
		timeStamp = newMoment.format(_MomentFormat);
		dataTimeline.push(timeStamp)

		// OpeningData setup
		let oValue = Number(data.Open[index]);
		openData.push(oValue);
		// highData setup
		let hValue = Number(data.High[index]);
		highData.push(hValue);
		// lowData setup
		let lValue = Number(data.Low[index]);
		lowData.push(lValue);
		// ClosingData Setup
		let cValue = Number(data.Close[index]);
		closeData.push(cValue);
		// Trading Data Set up
		let tValue = Number(data.Trade[index]);
		tradeData.push(tValue);

		// ohlcData setup (candlestick)
		let ohlcVal = {
			o: oValue,
			h: hValue,
			l: lValue,
			c: cValue,
			t: timeStamp
		};
		ohlcData.push(ohlcVal);
	}
	//console.log(_Chart1Times);
	//_Chart1Times = (_Chart1Times);
	//console.log(_Chart1Times);
	var chart1  = document.getElementById('chart1').getContext('2d');
	//var chart2  = document.getElementById('chart2').getContext('2d');
	//var chart3  = document.getElementById('chart3').getContext('2d');
	//var chart4  = document.getElementById('chart4').getContext('2d');

	chart1.canvas.width = 1000;	
	chart1.canvas.height = 400;	

	// Params: (data,timeline,chartFormat)
	// data: array of values (so far h or l or o or c or ohlc{} or array of arrays of data. to support multi data graphs [[openData],[closeData]]
	// timeline: array of times []
	// ChartFormat: string of availible formats NOTE: does not support multi data graphs or array for multi type graphs ['line','bar']
	var test = getChartConfig([closeData,openData],dataTimeline,["line",'olhc']);
	console.log(" Got config", test);
	var chart1Config = { //getChartConfig(closeData,dataTimeline,"line"){
	// The type of chart we want to create
	type: 'bar',
	// The data for our dataset
	data: {
	 datasets: [{
	    type: 'line',
	    label: "Prices",
	    backgroundColor: 'rgb(220, 219, 219)',
	    borderColor: 'rgb(200, 199, 199)',
	    fill: false,
	    yAxisID: "closingPrices",
	    data: closeData,
	 },
	 {
	    type: 'bar',
	    label: "opening prices",
	    backgroundColor: 'rgb(120, 219, 219)',
	    borderColor: 'rgb(230, 10, 199)',
	    fill: false,
	    yAxisID: "openingPrices",
	    data: openData, //???G
	 }],
	 
 	    labels: dataTimeline //get the date List, dateList in DB 		
	},
	// Configuration options go here
	options: {
		responsive: true,
		title:{
			display: true,
			text: "data", //Classname goes here
		},
		layout: {
			    padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			    }
			},
		//events: [],
		
		/*tooltips: {
			enabled: true,
		},*/

		scales: {
			xAxes:[{
				barThickness: 10,
				type: "time",
				time: {
					//format: timeFormat,
					min: _Chart1Times[0],
					max: _Chart1Times[_Chart1Times.length-1],
					tooltipFormat: _TimeFormat,
				},
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Date'
				},
					ticks: {
						maxRotation: 0,
						//autoSkip: false,
						autoSkipPadding: 2
					}
				
			}],
			yAxes: [{
					id: "closingPrices",
					position: 'left',
					type: "linear",
					scaleLabel: {	
						display: true,
						labelString: 'Price'
					},
					ticks: {
						//max: Number(2),//Where secMax comes in
						//min: Number(0)
					}
				},{
					id: "openingPrices",
					type: "linear",
					display: false,
					scaleLabel: {	
						display: false,
						labelString: 'Closing Bar'
					}
				}]	
		},
		zoom: {
			enabled: true,
			//drag: false,
			mode: 'x',
			limits: {
				max: 30,
				min: 0.5
			}
		},
		pan: {
			// Boolean to enable panning
			enabled: true,
			// Panning directions. Remove the appropriate direction to disable 
			// Eg. 'y' would only allow panning in the y direction
			mode: 'xy',
			rangeMin: {
				// Format of min pan range depends on scale type
				x: null,
				y: null
			},
			rangeMax: {
				// Format of max pan range depends on scale type
				x: null,
				y: null
			}
		},
		elements: {
			line: {
				tension:0,
			}
		}
		}
	};

	window.chart1 = new Chart(chart1,chart1Config);
	// Get custom places for updating individual charts
	// (0) which dataste
	// [5] which point index
	var point = window.chart1.getDatasetMeta(0).data[5];
	//console.log(point);
	point.custom = point.custom || {};
	point.custom.borderColor = "green"
	point.custom.borderWidth = 4;
	point.custom.radius = 5;
	window.chart1.update();

	//Set up custom Points

	// Set up intervalss

}

//This is the real shiz
function getChartConfig(data,dataTimeline,chartTypes){
	var chartTitle = "Test Chart Title Dnamic update";
	//console.log("getting data for",data,chartTypes)
	// Will contain the basic info needed in every chart, options will be added as data is parsed
	var config = getConfigTemplate(chartTitle,dataTimeline);
	console.log("gettingConfig",config);
	
	// Parse the types and set config to types
	// Set the initial type tobe whatever was first
	config.type = chartTypes[0];
	for (var i = 0; i < chartTypes.length; i++){
		let type = chartTypes[i];
		let dataSet = getDataSet(type,data);
		config.data.datasets.push(dataSet);
		
		console.log("type", type);
		
	}
	console.log("After dataSetup",config);
	return config;
}

// Not sute how customizable this will be,. returns a proper dataset
function getDataSet(type,data){
	var color = window.chart1Colors.shift();
	console.log(data);
	var dataset = {};
	if (type == "line"){
		dataset.label= "line"; 
		dataset.borderColor = color; 
		dataset.data = data;
		dataset.fill = false;
	} else if (type == "bar"){
		dataset.label= "bar"; 
		dataset.borderColor = color; 
		dataset.data = data;
		dataset.fill = false;
	
	}else if (type == "candlestick") {
		dataset.label= "candlestick"; 
		dataset.data = data;
	}else if (type == "pie"){
		dataset.label= "pie"; 
		dataset.data = data;
		dataset.backgroundColor = window.pieColors; // list of colors
	} else{
		console.log("chart not supported yet");
	}
	return dataset;
}



	

/*
G
var chartConfig  = {
	type: 'bar',
	 
 	    labels: _Chart1Times //get the date List, dateList in DB 		
	},
	// Configuration options go here
	options: {
		responsive: true,
		title:{
			display: true,
			text: "Closing Prices", //Classname goes here
		},
		layout: {
			    padding: {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0
			    }
			},
		//events: [],
		
		/*tooltips: {
			enabled: true,
		},

		scales: {
			xAxes:[{
				barThickness: 10,
				type: "time",
				time: {
					//format: timeFormat,
					min: _Chart1Times[0],
					max: _Chart1Times[_Chart1Times.length-1],
					tooltipFormat: _TimeFormat,
				},
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Date'
				},
					ticks: {
						maxRotation: 0,
						//autoSkip: false,
						autoSkipPadding: 2
					}
				
			}],
			yAxes: [{
					id: "closingPrices",
					position: 'left',
					type: "linear",
					scaleLabel: {	
						display: true,
						labelString: 'Price'
					},
					ticks: {
						//max: Number(2),//Where secMax comes in
						//min: Number(0)
					}
				},{
					id: "closingBar",
					type: "linear",
					display: false,
					scaleLabel: {	
						display: false,
						labelString: 'Closing Bar'
					}
				}]	
		},
		zoom: {
			enabled: true,
			//drag: false,
			mode: 'x',
			limits: {
				max: 30,
				min: 0.5
			}
		},
		pan: {
			// Boolean to enable panning
			enabled: true,
			// Panning directions. Remove the appropriate direction to disable 
			// Eg. 'y' would only allow panning in the y direction
			mode: 'xy',
			rangeMin: {
				// Format of min pan range depends on scale type
				x: null,
				y: null
			},
			rangeMax: {
				// Format of max pan range depends on scale type
				x: null,
				y: null
			}
		},
		elements: {
			line: {
				tension:0,
			}
		}
		}

}
return chartConfig;
}
*/

function getConfigTemplate(chartTitle,dataTimeline) {
	var template = { 
		type : '',
		data : {
			datasets: [],
			labels: dataTimeline
		},
		options: {
			resonsive: true,
			title: {
				display: true,
				text: chartTitle
			},
			// events:, ???
			// tooltips:,???
			scales: {
				xAxes:[{
					type: "time",
					time: {
						//format: timeFormat,
						min: dataTimeline[0],
						max: dataTimeline[dataTimeline.length-1],
						tooltipFormat: _TimeFormat,
					},
					display: true,
					scaleLabel: {
						display: false,
						labelString: 'Time'
					},
						ticks: {
							maxRotation: 0,
							//autoSkip: false,
							autoSkipPadding: 2
						}
					
				}],
				yAxes: []	
			},
			zoom: {
				enabled: true,
				//drag: false,
				mode: 'x',
				limits: {
					max: 20,
					min: 1
				}
			},
			pan: {
				enabled: true,
				mode: 'xy',
				rangeMin: {
					x: null,
					y: null
				},
				rangeMax: {
					x: null,
					y: null
				}
			},
		}
	};
	console.log("returning template",template);
	return template;
}



function refreshChart(){
//	console.log("Updating",_TimelineArr,_HpsData);
	window.chart1.update(0);
}
