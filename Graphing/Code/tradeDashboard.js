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
	var chartCanvas  = document.getElementById('chart1').getContext('2d');
	//var chart2  = document.getElementById('chart2').getContext('2d');
	//var chart3  = document.getElementById('chart3').getContext('2d');
	//var chart4  = document.getElementById('chart4').getContext('2d');

	chartCanvas.canvas.width = 1000;	
	chartCanvas.canvas.height = 400;	

	// Params: (data,timeline,chartFormat)
	// data: array of values (so far h or l or o or c or ohlc{} or array of arrays of data. to support multi data graphs [[openData],[closeData]]
	// timeline: array of times []
	// ChartFormat: list of strings of desired formats]
	var chart1Config = getChartConfig([ohlcData],dataTimeline,["candlestick"]);
	console.log(" Got config ", chart1Config);
	window.chart1 = new Chart(chart1,chart1Config);
	// Get custom places for updating individual charts
	// (0) which dataste
	// [5] which point index
	window.chart1.update();
	//var point = window.chart1.getDatasetMeta(0).data[5];
	//console.log(point);
	//point.custom = point.custom || {};
	//point.custom.borderColor = "green"
	//point.custom.borderWidth = 4;
	//point.custom.radius = 5;
	//window.chart1.update();

		//Set up custom Points

		// Set up intervalss

	window.chart1 = new Chart(chartCanvas,chart1Config);
	window.chart1.update();
	// Get custom places for updating individual charts
	// (0) which datassIDt
	// [5] which point index
	//var point = window.chart1.getDatasetMeta(0).data[1];
	//console.log(point);
	//point.custom = point.custom || {};
	//point.custom.borderColor = "green"
	//point.custom.borderWidth = 4;
	//point.custom.radius = 5;
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
	//console.log("gettingConfig",config);
	
	// Parse the types and set config to types
	// Set the initial type tobe whatever was first
	config.type = chartTypes[0];
	if (config.type == "candlestick"){
		config = {
			type: 'candlestick',
			data: {datasets:[ ]}
		};
		var dataSet = getDataSet(config.type,data[0]);
		console.log("data=",dataSet);
		config.data.datasets.push(dataSet);
	}else {
		// Resets config to keep from confusion			
		for (var i = 0; i < chartTypes.length; i++){
			let type = chartTypes[i];
			let dataSet = getDataSet(type,data[i]);
			config.data.datasets.push(dataSet);
			let yOptions = getYAxes(type,data[i]);
			config.options.scales.yAxes.push(yOptions);
		}
	}
	return config;
}

// Not sute how customizable this will be,. returns a proper dataset
function getDataSet(type,data){ // Eventually pass in cusom label names and/or IDs
	var color = window.chart1Colors.shift();
	//console.log(data);
	var dataset = {};
	if (type == "line"){
		dataset.type = 'line';
		dataset.label= "line"; 
		dataset.borderColor = color; 
		dataset.backgroundColor = 'rgb(200,219,219)';
		dataset.data = data;
		dataset.fill = false;
		dataset.yAxisID = "priceLine"; // iD param
	} else if (type == "bar"){
		dataset.type = 'bar';
		dataset.label= "bar"; 
		dataset.borderColor = color; 
		dataset.data = data;
		dataset.fill = false;
		dataset.yAxisID = type; // iD param
	}else if (type == "candlestick") {
		dataset.label= "candlestick"; 
		dataset.data = data;
	}else if (type == "pie"){
		dataset.type = 'pie';
		dataset.label= "pie"; 
		dataset.data = data;
		dataset.backgroundColor = window.pieColors; // list of colors
	} else{
		console.log("chart not supported yet");
	}
	return dataset;
}


function getYAxes(type,data){
	var axisOptions = {};
	if (type == "line"){
		axisOptions.id = "priceLine";
		axisOptions.position = 'left'; // window.axispositions.shift()
		axisOptions.type = 'linear'; // should always be linear unless pie or something
		axisOptions.scaleLabel = { display: true,
					  labelString: 'price' // maybe passed in as parametr/ID
					};
		axisOptions.ticks = {}
	} else if (type == "bar"){
		axisOptions.id = type;
		axisOptions.position = 'left'; // window.axispositions.shift()
		axisOptions.type = 'linear'; // should always be linear unless pie or something
		axisOptions.scaleLabel = { display: true,
					  labelString: 'price' // maybe passed in as parametr/ID
					};
	
	}else if (type == "candlestick") {
		axisOptions.id = type;
		axisOptions.position = 'left'; // window.axispositions.shift()
		axisOptions.type = 'linear'; // should always be linear unless pie or something
		axisOptions.scaleLabel = { display: true,
					  labelString: 'price' // maybe passed in as parametr/ID
					};

	}else if (type == "pie"){
		axisOptions.id = type;
		axisOptions.position = 'left'; // window.axispositions.shift()
		axisOptions.type = 'linear'; // havent tested...
		axisOptions.scaleLabel = { display: true,
					  labelString: 'price' // maybe passed in as parametr/ID
					};
	} else{
		console.log("chart not supported yet");
	}
	return axisOptions;
}


function getConfigTemplate(chartTitle,dataTimeline) {
	var template = { 
		type : '',
		data : {
			datasets: [],
			labels: dataTimeline
		},
		options: {
			title: {
				display: true,
				text: chartTitle
			},
			// events:, ???
			// tooltips:,???
			scales: {
				xAxes:[{
					barThickness: 10,
					type: "time",
					time: {
						//format: timeFormat,
						min: dataTimeline[0],
						max: dataTimeline[dataTimeline.length-1],
						tooltipFormat: _TimeFormat,
					},
					display: true,
					scaleLabel: {
						display: true,
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
			elements: {
				line: {
					tension:0,
				}
			}
		}
	};
	return template;
}



function refreshChart(){
//	console.log("Updating",_TimelineArr,_HpsData);
	window.chart1.update(0);
}
