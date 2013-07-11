var users = require('./users');
var courses = require('./courses');
var format = require('./format');

//might want to add lecture id? null if not in any lecture?
function Note(nid, uid, cid, date, message, ques, reply, convo, mentions, hashtags) {
	this.nid		= nid;
	this.uid		= uid;
	this.cid		= cid;
	this.date		= date;
	this.message	= message;
	this.ques		= ques;
	this.reply		= reply;
	this.convo		= convo;
	this.mentions	= mentions;
	this.hashtags	= hashtags;
}

var notedb = [
	new Note(0, 0, 0, new Date(), 'Any hints for Q1 #homework1? Thanks! #326', true, null, 0, [], ['homework1', '326']),
	new Note(1, 1, 0, new Date(), 'reply to @erecto check this out wikipedia.com/java #326', false, 0, 0, ['erecto'], ['326']),
	new Note(2, 0, 0, new Date(), 'reply to @richards thank you! #326', false, 1, 0, ['rszeto'], ['326']),
	new Note(3, 1, 1, new Date(), 'This is just a test note for this course! #test', false, null, null, [], ['test']),
	new Note(4, 1, 3, new Date(), 'This is a different test note for this different course! #test', false, null, null, [], ['test']),
];

// ### *function*: getInfoByNID
/**
*	Returns information about the note.
*	@param {integer} nid
*	@return {object} note, null if not found
*/
function getInfoByNID (nid) {
	for (var i=0; i<notedb.length; i++) {
		if (notedb[i].nid === nid) {
			return notedb[i];
		}
	}
	return null;
}
exports.getInfoByNID = getInfoByNID;

// ### *function*: getNotes
/**
*	Returns information about the notes.
*	@param {integer} list of notes identification numbers
*	@return {array} list of notes objects
*/
function getNotes (nidList) {
	var notesList = [];
	for (var i=0; i<nidList.length; i++) {
		var n = getInfoByNID(nidList[i]);
		if (n !== null) {
			var user = users.getInfoByUID(n.uid);
			var course = courses.getInfoByCID(n.cid);
			var note = {nid: n.nid, uid: n.uid, cid: n.cid, date: n.date, message: n.message, ques: n.ques, reply: n.reply, convo: n.convo, mentions: n.mentions, hashtags: n.hashtags, name: user.name, username: user.username, semester: course.semester, code: course.code};
			note.date = format.getDateTimeDisplay(n.date);
			notesList.push(note);
		}
	}
	return notesList;
}
exports.getNotes = getNotes;

// ### *function*: deleteNote
/**
*	Deletes note owned by logged in user. Must also delete from notes assoc with user, course and lecture lists. Also, mentions, hashtags and conversations.
*	Consider --- What if note deleted is first in a conversation? Or a note that another note replied to?
*	@param {integer} note id
*/
function deleteNote (nid) {
	for (var i=0; i<notedb.length; i++) {
		if (notedb[i].nid === nid) {
			var cid = notedb[i].cid;
			var uid = notedb[i].uid;
			break;
		}
	}
	
	//delete note from user list
	var user = users.getInfoByUID(uid);
	for (var j=0; j<user.notes.length; j++) {
		if (user.notes[j] = nid) {
			break;
		}
	}
	user.notes.splice(j, 1);
	
	//delete note from course list
	var course = courses.getInfoByCID(cid);
	for (var k=0; k<course.notes.length; k++) {
		if (course.notes[k] === nid) {
			break;
		}
	}
	course.notes.splice(k, 1);
	
	//delete note from lecture list
	
	//delete note from notes list
	notedb.splice(i, 1);
}
exports.deleteNote = deleteNote;

// ### *function*: createNote
/**
*	Creates new note. Must add note to note, user, course and lecture lists. Also need to add to mentions, hashtags and conversation.
*	Must mark if this note is a question and a reply.
*	Need to know if where this note was written from: course or lecture page.
*	@param {integer} user id 
*	@param {string} note message
*	@param {integer} course id
*/
function createNote (uid, msg, cid, ques, reply) {
	var user = users.getInfoByUID(uid);
	var course = courses.getInfoByCID(cid);
	
	//add note to notes list
	//convo = null, mentions and hashtags = [] for now
	//add #courseCode to end of msg - remember to check for duplicates, oh! note that notes can be written from lecture page so gotta add #courseCode_#lectureNum sigh...
	//use codeTag from course.ejs - need to lookup jquery attribute but ugh! no internet access! >.<
	var msg = msg + ' #' + course.code;
	
	//if note is a reply to a note already in a convo, add new note to same convo
	if (reply !== "null") {
		var nreply = getInfoByNID(parseInt(reply));
		if (nreply.convo != null) {
			var nconvo = nreply.convo;
		} else {
			var nconvo = null;
		}
	} else {
		var nconvo = null;
	}
	
	var newNote = new Note (notedb.length, uid, cid, new Date(), msg, ques, reply, nconvo, [], []);
	notedb.push(newNote);
	
	//add note to user list
	user.notes.push(newNote.nid);
	
	//add note to course list
	course.notes.push(newNote.nid);
	
	//add note to lecture list
	
	var note = {nid: newNote.nid, uid: newNote.uid, cid: newNote.cid, date: newNote.date, message: newNote.message, ques: newNote.ques, reply: newNote.reply, convo: newNote.convo, mentions: newNote.mentions, hashtags: newNote.hashtags, name: user.name, username: user.username, code: course.code};
	note.date = format.getDateTimeDisplay(newNote.date);
	
	return note;
}
exports.createNote = createNote;

// ### *function*: searchNotes
/**
*	Searches notes (messages of notes) given search query. Uses regular expression so partial match is also included. Only searches notes of courses logged in user is enrolled in.
*	@param {integer} user id
*	@param {string} query phrase
*	@return {list} note objects partially or completely matching query phrase
*/
function searchNotes (uid, query) {
	var regQuery = new RegExp(query, "gi");
	resultList = [];
	
	var user = users.getInfoByUID(uid);
	var courseList = user.courses;
	
	for (var i=0; i<courseList.length; i++) {
		var course = courses.getInfoByCID(courseList[i]);
		var notesList = course.notes;
		for (var j=0; j<notesList.length; j++) {
			var note = getInfoByNID(notesList[j]);
			if (note.message.match(regQuery) !== null) {
				var noteUser = users.getInfoByUID(note.uid);
				var newNote = {nid: note.nid, uid: note.uid, cid: note.cid, date: format.getDateTimeDisplay(note.date), message: note.message, ques: note.ques, reply: note.reply, convo: note.convo, mentions: note.mentions, hashtags: note.hashtags, name: noteUser.name, username: noteUser.username, code: course.code};
				resultList.push(newNote);
			}
		}
	}
	
	return resultList;
}
exports.searchNotes = searchNotes;

// ### *function*: getNotesByConvo
/**
*	Returns all notes under the same conversation.
*	@param {integer} note id
*	@return	{list} note objects
*/
function getNotesByConvo (nid) {
	resultList = [];
	
	var note = getInfoByNID(nid);
	resultList.push(note);
	var reply = note.reply;
	
	while (reply !== null) {
		note = getInfoByNID(reply);
		resultList.push(note);
		reply = note.reply;
	}
	
	return resultList;
}
exports.getNotesByConvo = getNotesByConvo;