function Lecture(lid, semester, courseCode, courseTitle, number, cid, date, notes) {
	this.lid			= lid;
	this.semester		= semester;
	this.courseCode		= courseCode;
	this.courseTitle	= courseTitle;
	this.number			= number;
	this.cid			= cid;
	this.date			= date;
	this.notes 			= notes;
}

var lecturedb = [
	new Lecture(0, 'Spr 2013', 'COMPSCI326', 'Web Programming', '1', 0, 'Feb 4, 2013', []),
	new Lecture(1, 'Spr 2013', 'COMPSCI326', 'Web Programming', '2', 0, 'Feb 6, 2013', []),
	new Lecture(2, 'Spr 2013', 'COMPSCI326', 'Web Programming', '3', 0, 'Feb 9, 2013', []),
	new Lecture(3, 'Spr 2013', 'COMPSCI326', 'Web Programming', '4', 0, 'Feb 11, 2013', []),
	new Lecture(4, 'Spr 2013', 'COMPSCI326', 'Web Programming', '5', 0, 'Feb 13, 2013', [])
];
exports.lecturedb = lecturedb;

// ### *function*: getInfoByLID
/**
*	Returns information about the course.
*	@param {integer} course identification number
*	@return {object} course, null if not found
*/
function getInfoByLID (lid) {
	for (var i=0; i<lecturedb.length; i++) {
		if (lecturedb[i].lid === lid) {
			return lecturedb[i];
		}
	}
	return null;
}
exports.getInfoByLID = getInfoByLID;

// ### *function*: getLectures
/**
*	Returns information about the lectures.
*	@param {integer} list of lecture identification numbers
*	@return {array} lecture objects
*/
function getLectures (lidList) {
	var lectureList = [];
	for (var i=0; i<lidList.length; i++) {
		var c = getInfoByLID(lidList[i]);
		if (c !== null) {
			lectureList.push(c);
		}
	}
	return lectureList;
}
exports.getLectures = getLectures;