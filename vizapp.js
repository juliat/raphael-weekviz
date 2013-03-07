var yCoordMap = {}
var xCoordMap = {}

var yUnit = 0;
var xUnit = 0;
var leftMargin = 20;
var topMargin = 20;

var fbData;
var emailData;

$.getJSON("facebook-inbox.json", function(json) {
	console.log('facebook');
    console.log(json);
    fbData = json;
    // debugger;
   // drawChart(fbData);
});

$.getJSON("messages.json", function(json) {
	console.log('email');
	console.log(json);
	emailData = json;
	// drawChart(emailData);
});


function init() {
	drawChart(fbData)
}



/* more or less the main function for drawing the chart */
function drawChart(response) {
	console.log('in drawChart');
	console.log(response);
	var paper = drawCanvas();
	drawAxis(paper);
	drawPoints(response, paper);
}

function drawPoints(response, paper) {
	console.log('drawing circles');
	var circlePoints = getPoints(response);
	console.log('circle points');
	console.log(circlePoints);
	drawCircles(paper, circlePoints);
}

/* set up a raphael canvas and return the canvas object so we can pass it around to otehr drawing funcitons */
function drawCanvas() {
	var containerElement = $('#holder')[0];
	var width = 1000;
	var height = 675;
	var paper = new Raphael(containerElement, width, height);
	return paper;
}


/* get the day and time of a message object so we can use it to plot a point or points for that message.
returns an array of days and times of messages */
function getPoints(response) {
	console.log('in getPoints');
	console.log(response);
	var circlePoints = [];
	// for each message chain we want to know when it started and when any followup comments occured
	// debugger;
	var dateCreated;
	var coords;
	var responseLength = response.data.length;
	console.log('response length is '+responseLength);
	var i = 0;
	while (i< responseLength) {
		// console.log('response data index is ' + i);
		// console.log(response.data[i]);
		if (typeof response.data[i].comments != "undefined") {
			// console.log('looping over this messages comments')
			var messagesArray = response.data[i].comments.data;
			// console.log('messages array length is ' + messagesArray.length);
			var j = 0;
			while (j < messagesArray.length) {
				// console.log('messagearray index is ' + i);
				dateCreated = messagesArray[j].created_time;
				coords = getGraphLocation(dateCreated);
				circlePoints.push(coords);
				j++;
			}
			// console.log('finished looping over messages comments');
		}
		else {
			console.log('this message had no comments field');
			dateCreated = response.data[i].updated_time;
			coords = getGraphLocation(dateCreated);
			circlePoints.push(coords);
		}
		i++;
	}
	return circlePoints;
}

function getGraphLocation(dateCreated) {
	var day = moment(dateCreated).format('d');
	var hour = moment(dateCreated).format('H');
	var minutes = moment(dateCreated).format('mm');
	// x position is based on time
	var x = timeToXCoord(hour, minutes);
	// y position is based on day
	var y = dayToYCoord(day);
	var coords = {
		'cx' : x,
		'cy' : y
	}
	return coords;
}

function timeToXCoord(hour, minutes) {
	var x = hour * xUnit;
	var minutesFraction = minutes/60;
	x = x + (minutesFraction * xUnit) + leftMargin;
	return x;
}

function dayToYCoord(dayNum) {
	var y = (dayNum * yUnit) + topMargin;
	return y;
}

/* draw the axis-es of the graph (times of day across the bottom, days of the week down the side) */
function drawAxis(paper) {
	// draw x axis
	var timesOfDay = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
	var textSpacing = (paper.width-leftMargin)/(timesOfDay.length);
	xUnit = textSpacing;
	var yStringPos = paper.height - topMargin;
	for (var i = 0; i < timesOfDay.length; i ++) {
		var timeString = timesOfDay[i];
		var xStringPos = (i*textSpacing)+leftMargin;
		paper.text(xStringPos, yStringPos, timeString);
		// add to x coordinate map
		xCoordMap[timeString] = xStringPos;
	}

	// draw y axis
	var daysOfWeek = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'];
	textSpacing = (paper.height - topMargin)/(daysOfWeek.length);
	yUnit = textSpacing;
	xStringPos = leftMargin;
	// go through the array of days and write each one on the canvas using the textspacing value
	for (var i = 0; i < daysOfWeek.length; i++) {
		var dayString = daysOfWeek[i];
		yStringPos = (i*textSpacing) + topMargin;
		paper.text(xStringPos, yStringPos, dayString);
		// add to y coord map
		yCoordMap[dayString] = yStringPos;
	}
}

/* draw circles on the paper at a given location. should pass this function an array/nested array with circle coordinates/dimensions */
function drawCircles(paper, circles) {
	var cx;
	var cy;
	for (var i = 0; i < circles.length; i++) {
		cx = circles[i]['cx'];
		cy = circles[i]['cy'];
		var radius = 2;
		var circle = paper.circle(cx, cy, radius);
		circle.attr("fill", "#000");
		circle.attr("opacity", 0.25);
	}
}