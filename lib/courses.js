function Course(cid, semester, code, title, schedule, instructor, students, notes, lectures) {
  this.cid      = cid;
  this.semester	= semester;
  this.code		= code;
  this.title	= title;
  this.schedule	= schedule;
  this.instructor = instructor;
  this.students	= students;
  this.notes 	= notes;
  this.lectures = lectures;
}

var coursedb = [
	new Course(0, 'Spr 2013', '326', 'Web Programming', 'MWF 11:15am - 12:05pm', [1], [0], [0,1,2], [0,1,2,3,4]),
	new Course(1, 'Spr 2013', '230', 'Computer Systems Principles', 'TuTh 1:00pm - 2:15pm', [1], [2], [3], []),
	new Course(2, 'Fal 2013', '521', 'Software Engineering: Analysis and Evaluation', 'MW 10:35am - 11:50am', [3], [0], [], []),
	new Course(3, 'Sum 2013', '187', 'Programming with Data Structures', 'Online', [1], [2], [4], [])
];
exports.coursedb = coursedb;

// ### *function*: getInfoByCID
/**
*	Returns information about the course.
*	@param {integer} course identification number
*	@return {object} course
*/
function getInfoByCID (cid) {
	for (var i=0; i<coursedb.length; i++) {
		if (coursedb[i].cid === cid) {
			return coursedb[i];
		}
	}
	return null;
}
exports.getInfoByCID = getInfoByCID;

// ### *function*: getCourses
/**
*	Returns information about the courses.
*	@param {integer} list of course identification numbers
*	@return {array} list of course objects
*/
function getCourses (cidList) {
	var courseList = [];
	var notesList = [];
	for (var i=0; i<cidList.length; i++) {
		var c = getInfoByCID(cidList[i]);
		if (c !== null) {
			courseList.push(c);
			for (var j=0; j<c.notes.length; j++) {
				notesList.push(c.notes[j]);
			}
		}
	}
	return {courseList: courseList, notesList: notesList};
}
exports.getCourses = getCourses;