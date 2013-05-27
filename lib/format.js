// ### *function*: getDateTimeDisplay
/**
*	Returns nice format for date and time: Day, MMM DD, YYYY - HH:MM am/pm
*	@param {object} date
*	@return {string} formatted date 
*/
function getDateTimeDisplay(d){
	var curr_day;
	switch (d.getDay()){
		case 0:
			curr_day = "Sun";
			break;
		case 1:
			curr_day = "Mon";
			break;
		case 2:
			curr_day = "Tue";
			break;
		case 3:
			curr_day = "Wed";
			break;
		case 4:
			curr_day = "Thu";
			break;
		case 5:
			curr_day = "Fri";
			break;
		case 6:
			curr_day = "Sat";
			break;
		default:
			curr_day = "N/A";
	}

	var curr_month;
	switch (d.getMonth()){
		case 0:
			curr_month = "Jan";
			break;
		case 1:
			curr_month = "Feb";
			break;
		case 2:
			curr_month = "Mar";
			break;
		case 3:
			curr_month = "Apr";
			break;
		case 4:
			curr_month = "May";
			break;
		case 5:
			curr_month = "Jun";
			break;
		case 6:
			curr_month = "Jul";
			break;
		case 7:
			curr_month = "Aug";
			break;
		case 8:
			curr_month = "Sep";
			break;
		case 9:
			curr_month = "Oct";
			break;
		case 10:
			curr_month = "Nov";
			break;
		case 11:
			curr_month = "Dec";
			break;
		default:
			curr_month = "N/A";
	}
	
	var curr_date = d.getDate();
	var curr_year = d.getFullYear();
	
	var tl = "am";
	var curr_hour = d.getHours();
	if (curr_hour > 12) { 
		curr_hour = curr_hour - 12; 
		tl = "pm";
	}
	
	var curr_mins = d.getMinutes();
	if (curr_mins < 10) { curr_mins = "0" + curr_mins; }
	
	return (curr_day + ", " + curr_month + " " + curr_date + ", " + curr_year + " - " + curr_hour + ":" + curr_mins + " " + tl);
}
exports.getDateTimeDisplay = getDateTimeDisplay;