var format = require('../lib/format');
var users = require('../lib/users');
var courses = require('../lib/courses');
var lectures = require('../lib/lectures');
var notes = require('../lib/notes');
var entry = require('../routes/entry');
var online = entry.online;

// ### home
/**
*	Displays user's courses, notes of those courses and trending hashtags relevant to user.
*	Need to add note-filter drop down menu later.
*/
exports.home = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var user = users.getInfoByUsername(req.params.username);
		var cl = courses.getCourses(user.courses);
		var notesList = notes.getNotes(cl.notesList);
		var rightNow = format.getDateTimeDisplay(new Date());
		
		res.render('home', { title: loggedInUser.username + ' - Home',
						loggedInUser: loggedInUser.username,
						courses: cl.courseList,
						notes: notesList,
						date: rightNow
						});
	}
};

// ### profile
/**
*	Displays user's courses and notes written by user.
*/
exports.profile = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var user = users.getInfoByUsername(req.params.username);
		var cl = courses.getCourses(user.courses);
		var notesList = notes.getNotes(user.notes);
		var rightNow = format.getDateTimeDisplay(new Date());
		
		res.render('profile', { title: loggedInUser.username + ' - Home',
						loggedInUser: loggedInUser.username,
						courses: cl.courseList,
						notes: notesList,
						date: rightNow
						});
	}
};

// ### course
/**
*	Displays basic information about the course (semester, code and title), list of lectures and notes under that course.
*/
exports.course = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var course = courses.getInfoByCID(parseInt(req.params.courseNum));
		var notesList = notes.getNotes(course.notes);
		var lectureList = lectures.getLectures(course.lectures);
		
		var rightNow = format.getDateTimeDisplay(new Date());
		
		res.render('course', { title: course.code + ' - Course Page',
						loggedInUser: loggedInUser.username,
						courseSem: course.semester,
						courseCode: course.code,
						courseTitle: course.title,
						courseCID: course.cid,
						lectureLID: 'null',
						notes: notesList,
						lectures: lectureList,
						date: rightNow
						});
	}
};

// ### lecture
/**
*	ATM, only displays lecture information.
*/
exports.lecture = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var course = courses.getInfoByCID(parseInt(req.params.courseNum));
		var lecture = lectures.getInfoByLID(parseInt(req.params.lectureNum));
		
		res.render('lecture', { title: course.code + ' - Lecture ' + lecture.number,
						loggedInUser: loggedInUser.username,
						semester: course.semester,
						courseCode: course.code,
						courseTitle: course.title,
						lectureDate: lecture.date,
						lectureNum: lecture.number
						});
	}
};

// ### deleteNote
/**
*	Deletes note. Note must be owned by loggedin user. 
*/
exports.deleteNote = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var noteid = req.body.noteid;
		notes.deleteNote(parseInt(noteid));
		res.json(noteid);
	}
};

// ### createNote
/**
*	Creates note. 
*	Must take into account where note is being created - from course page or lecture page. 
*/
exports.createNote = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		console.log("req.body.ques" + req.body.ques);
		var newNote = notes.createNote(loggedInUser.uid, req.body.msg, parseInt(req.body.cid), Boolean(req.body.ques));
		res.json(newNote);
	}
};

// ### searchN
/**
*	Searches notes (messages of notes) for query phrase. Only searches notes of courses that logged in user is enrolled in.
*/
exports.searchN = function(req,res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var searchResults = notes.searchNotes(loggedInUser.uid, req.params.query);
		res.render('searchN', { title: 'Search Notes - ' + req.params.query,
						loggedInUser: loggedInUser.username,
						searchPhrase: req.params.query,
						notes: searchResults
						});
	}
};

// ### searchP
/**
*	Searches people (name and username) for query phrase. Searches everyone in the system.
*/
exports.searchP = function(req,res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var searchResults = users.searchUsers(req.params.query);
		res.render('searchP', { title: 'Search Users - ' + req.params.query,
						loggedInUser: loggedInUser.username,
						searchPhrase: req.params.query,
						users: searchResults
						});
	}
};

// ### searchBox
/**
*	Allows users to search from search box in the nav bar. Default is to search notes logged in user is enrolled in (searchN). 
*	Need to add searching lecture slides later.
*	Use typeahead hhmmm.. gotta figure out where to save data (will it be too much as objects? text files?)
*/
exports.searchBox = function(req,res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		var searchResults = notes.searchNotes(loggedInUser.uid, req.body.query);
		res.render('searchN', { title: 'Search Notes - ' + req.body.query,
						loggedInUser: loggedInUser.username,
						searchPhrase: req.body.query,
						notes: searchResults
						});
	}
};

exports.testModal = function(req, res) {
	res.render ('testModal', { title: 'Test Modal' });
};