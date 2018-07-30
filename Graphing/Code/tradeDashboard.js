///// CHARTING STUFF HEREE-----------___-
//yea
//
//
//
//
//
var _TradeDataArray = [];
var _TradeDataTimes = [];
var _TimeFormat = 'MM/DD/YYYY h:mm A';
getData();
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
	//console.log("Got data");
	//console.log(data);
	var jsonData = JSON.parse(data);
	//console.log(jsonData);
	createGraph(jsonData);
}

function createGraph(data){
	//console.log("parsing Data",data);
	//console.log(data.Close);
	//console.log(data.Close,data.Close.length,data.Close[0])
	for ( index in data.Close ) {
		//console.log("I="+index,"v="+data.Close[index]);
		let timeStamp = new Date(Number(index));
		//console.log(index,timeStamp);
		let value = Number(data.Close[index]);
		_TradeDataArray.push(value);
		_TradeDataTimes.push(timeStamp);

	}
	var chart1  = document.getElementById('chart1').getContext('2d');
	var chart1Config = {
	// The type of chart we want to create
	type: 'line',
	// The data for our dataset
	data: {
	 datasets: [{
	    type: 'line',
	    label: "Prices",
	    backgroundColor: 'rgb(220, 219, 219)',
	    borderColor: 'rgb(200, 199, 199)',
	    fill: false,
	    //yAxisID: "price",
	    data: _TradeDataArray, //???G
	 },
	 {
	    type: 'bar',
	    label: "Pces",
	    backgroundColor: 'rgb(120, 219, 219)',
	    borderColor: 'rgb(230, 10, 199)',
	    fill: false,
	    //yAxisID: "nada",
	    data: _TradeDataArray, //???G
	 }],
	 
 	    labels: _TradeDataTimes //get the date List, dateList in DB 		
	},
	// Configuration options go here
	options: {
		responsive: true,
		title:{
			display: true,
			text: "Close Times???", //Classname goes here
		},
		events: [''],

		scales: {
			xAxes:[{
				type: "time",
				time: {
					//format: timeFormat,
					min: _TradeDataTimes[0],
					max: _TradeDataTimes[_TradeDataTimes.length-1],
					tooltipFormat: _TimeFormat,
				},
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Time'
				},
					ticks: {
						maxRotation: 0,
						autoSkip: false,
						autoSkipPadding: 2
					}
				
			}],
			yAxes: [{
				//id: "hps",
				position: 'left',
				type: "linear",
				scaleLabel: {	
					display: true,
					labelString: 'Price'
				},
				ticks: {
					//max: Number(6000),//Where secMax comes in
					//min: Number(0)
				}
				}]	
			}
		}
	    };

	window.chart1 = new Chart(chart1,chart1Config);
	window.chart1.update();
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

}



function refreshChart(){
//	console.log("Updating",_TimelineArr,_HpsData);
	window.chart1.update(0);
}
