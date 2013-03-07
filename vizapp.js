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


/* more or less the main function for drawing the chart */
function drawChart(fbData, emailData) {
	console.log('in drawChart');
	console.log(fbData);
	var paper = drawCanvas();
	drawAxis(paper);
	drawFBPoints(fbData, paper);
	drawEmailPoints(emailData, paper);
}

function drawFBPoints(fbData, paper) {
	var fbPoints = getFacebookPoints(fbData);
	drawCircles(paper, fbPoints);
}

function drawEmailPoints(emailData, paper) {
	var emailPoints = getEmailPoints(emailData);
	// console.log(emailPoints);
	drawSquares(paper, emailPoints);
}

/* set up a raphael canvas and return the canvas object so we can pass it around to otehr drawing funcitons */
function drawCanvas() {
	var containerElement = $('#holder')[0];
	var width = 1000;
	var height = 675;
	var paper = new Raphael(containerElement, width, height);
	return paper;
}

function getEmailPoints(emailData) {
	var emailPoints = [];
	var dateCreated;
	var coords;
	var dataLen = emailData.length;
	i = 0;
	while (i < dataLen) {
		var emailMessage = emailData[i];
		date = emailMessage['date']+"";
		coords = getGraphLocation(date, 'X');
		// people = getEmailPeople(emailData[i]);
		// coords['people'] = people;
		emailPoints.push(coords);
		i++;
	}
	return emailPoints;
}

function getEmailPeople(email) {
	// debugger;
	var names = [];
	var toPeople = email.addresses.to;
	var fromPeople = email.addresses.from;
	if ($.isArray(toPeople)) {
		names.push(getNamesArray(toPeople));
	}
	else {
		names.push(name);
	}
	if ($.isArray(fromPeople)) {
		names.push(getNamesArray(fromPeople));
	}
	else {
		names.push(name);
	}
	return names;	
}

/* get the day and time of a message object so we can use it to plot a point or points for that message.
returns an array of days and times of messages */
function getFacebookPoints(fbData) {
	var facebookPoints = [];
	// for each message chain we want to know when it started and when any followup comments occured
	var dateCreated;
	var coords;
	var responseLength = fbData.data.length;
	var i = 0;
	while (i< responseLength) {
		// people = getFBPeople(person = fbData.data[i].to.data);
		if (typeof fbData.data[i].comments != "undefined") {
			var messagesArray = fbData.data[i].comments.data;
			var j = 0;
			while (j < messagesArray.length) {
				dateCreated = messagesArray[j].created_time;
				coords = getGraphLocation(dateCreated, '');
				// coords['people'] = people;
				facebookPoints.push(coords);
				j++;
			}
			// console.log('finished looping over messages comments');
		}
		else {
			console.log('this message had no comments field');
			dateCreated = fbData.data[i].updated_time;
			coords = getGraphLocation(dateCreated, '');
			facebookPoints.push(coords);
		}
		i++;
	}
	return facebookPoints;
}

function getFBPeople(toListData) {
	var names = getNamesArray(toListData);
	return names;
}

function getNamesArray(namesObjectList) {
	var names = [];
	for (var i = 0; i < namesObjectList.length; i++) {
		var name = namesObjectList[i].name;
		if (name !== "Julia Teitelbaum") {
			names.push(name);
		}
	}	
	return names;
}

function getGraphLocation(dateCreated, format) {
	if (format != '') {
		// debugger;
		var day = moment(dateCreated, format).format('d');
		var hour = moment(dateCreated, format).format('H');
		var minutes = moment(dateCreated, format).format('mm');
	}
	else {
		var day = moment(dateCreated).format('d');
		var hour = moment(dateCreated).format('H');
		var minutes = moment(dateCreated).format('mm');
	}
	// x position is based on time
	var x = timeToXCoord(hour, minutes);
	// y position is based on day
	var y = dayToYCoord(day);
	var coords = {
		'x' : x,
		'y' : y
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
		cx = circles[i]['x'] + (leftMargin);
		cy = circles[i]['y'];
		var radius = 2;
		var circle = paper.circle(cx, cy, radius);
		circle.attr("fill", "#00ff00");
		circle.attr("opacity", 0.2);
	}
}

function drawSquares(paper, squares) {
	// debugger;
	var x;
	var y;
	var paperSquares = [];
	for (var i = 0; i < squares.length; i++) {
		sx = squares[i]['x'] + (leftMargin);
		sy = squares[i]['y'] + 10;
		var swidth = 4;
		var sheight = 4;
		paperSquares.push({
			type: 'rect',
			x: sx,
			y: sy,
			width: swidth,
			height: sheight,
			fill: '#ff0000',
			opacity: 0.2
		});
	}
	console.log('paperSquares');
	console.log(paperSquares);
	paper.add(paperSquares);
}
