function drawChart(data) {
	console.log('in drawChart');
	console.log(data);
	var paper = drawCanvas();
	drawAxis(paper);
	getDayTime(data);
}

function drawCanvas() {
	var containerElement = $('#holder')[0];
	var width = 1200;
	var height = 900;
	var paper = new Raphael(containerElement, width, height);
	return paper;
}

function getDayTime(response) {
	console.log('in getDayTime');
	if (typeof response.data[0].comments != undefined) {
		var messagesArray = response.data[0].comments.data;
		for (var i = 0; i < messagesArray.length; i++) {
			var dateCreated = messagesArray[i].created_time;
			var dayStr = moment(dateCreated).format('dddd');
			var timeStr = moment(dateCreated).format('h:mm a');
			// var day = somethingAboutDateCreated.
			debugger;
		}
	}
	else {
		console.log('this message had no comments field');
	}
}

function drawAxis(paper) {
	// draw x axis
	var timesOfDay = ['12am', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12pm', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
	var leftMargin = 50;
	var textSpacing = (paper.width-leftMargin)/(timesOfDay.length);
	var yStringPos = paper.height - 100;
	for (var i = 0; i < timesOfDay.length; i ++) {
		var timeString = timesOfDay[i];
		var xStringPos = (i*textSpacing)+leftMargin;
		paper.text(xStringPos, yStringPos, timeString);
	}
	// draw y axis
	var daysOfWeek = ['Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat', 'Sun'];
	var topMargin = 50;
	textSpacing = (paper.height - topMargin)/(daysOfWeek.length);
	xStringPos = leftMargin;
	for (var i = 0; i < daysOfWeek.length; i++) {
		var dayString = daysOfWeek[i];
		yStringPos = (i*textSpacing) + topMargin;
		paper.text(xStringPos, yStringPos, dayString);
	}
}

function drawCircles(paper) {
	var cx = 100;
	var cy = 100;
	var radius = 80;
	paper.circle(cx, cy, radius);
}