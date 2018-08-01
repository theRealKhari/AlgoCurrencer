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
	for ( index in data.Close ) {
		//console.log("I="+index,"v="+data.Close[index]);
		let timeStamp = String(new Date(Number(index)).toISOString()).split('.',5)[0];
		//console.log(timeStamp);
		newMoment = moment(timeStamp);
		//console.log(newMoment);
		timeStamp = newMoment.format(_MomentFormat);
		//console.log(index,timeStamp);
		let value = Number(data.Close[index]);
		_Chart1Data.push(value);
		_Chart1Times.push(timeStamp)

	}
	//console.log(_Chart1Times);
	//_Chart1Times = (_Chart1Times);
	console.log(_Chart1Times);
	var chart1  = document.getElementById('chart1').getContext('2d');
	var chart2  = document.getElementById('chart2').getContext('2d');
	var chart3  = document.getElementById('chart3').getContext('2d');
	var chart4  = document.getElementById('chart4').getContext('2d');

	var chart1Config = {
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
	    data: _Chart1Data,
	 },
	 {
	    type: 'bar',
	    label: "barPrice",
	    backgroundColor: 'rgb(120, 219, 219)',
	    borderColor: 'rgb(230, 10, 199)',
	    fill: false,
	    yAxisID: "closingPrices",
	    data: _Chart1Data, //???G
	 }],
	 
 	    labels: _Chart1Times //get the date List, dateList in DB 		
	},
	// Configuration options go here
	options: {
		responsive: true,
		maintainAspectRatio: false,
		title:{
			display: true,
			text: "Closing Prices", //Classname goes here
		},
		layout: {
			    padding: {
				left: 5,
				right: 5,
				top: 10,
				bottom: 10
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
	};

	window.chart1 = new Chart(chart1,chart1Config);
	// Get custom places for updating individual charts
	// (0) which dataste
	// [5] which point index
	point = window.chart1.getDatasetMeta(0).data[5];
	//console.log(point);
	point.custom = point.custom || {};
	point.custom.borderColor = "green"
	point.custom.borderWidth = 8;
	point.custom.radius = 5;
	window.chart1.update();

	//Set up custom Points

	// Set up intervalss
}



function refreshChart(){
//	console.log("Updating",_TimelineArr,_HpsData);
	window.chart1.update(0);
}
