//use spireid instead of uid?
function User(uid, spireid, name, username, password, email, courses, notes) {
  this.uid      = uid;
  this.spireid	= spireid;
  this.name     = name;
  this.username = username;
  this.password = password;
  this.email    = email; 
  this.courses = courses;
  this.notes = notes;
}

var userdb = [
	new User(0, 12345678, 'Ellysha Recto', 'erecto', 'ellysha', 'erecto@cns.umass.edu', [0,2], [0,2]),
	new User(1, 23456789, 'Timothy Richards', 'richards', 'richards', 'richards@cs.umass.edu', [0,1,3], [1,3,4]),
	new User(2, 34567890, 'Ryan Szeto', 'rszeto', null, 'rszeto@student.umass.edu', [1,3], []),
	new User(3, 45678901, 'Rick Adrion', 'adrion', null, 'adrion@cs.umass.edu', [2], [])
];
exports.userdb = userdb;

// ### *function*: getInfoByUsername
/**
*	Returns information about the user.
*	@param {string} username
*	@return {object} user
*/
function getInfoByUsername (username) {
	for (var i=0; i<userdb.length; i++) {
		if (userdb[i].username === username) {
			return userdb[i];
		}
	}
	return null;
}
exports.getInfoByUsername = getInfoByUsername;

// ### *function*: getInfoByEmail
/**
*	Returns information about the user.
*	@param {string} email
*	@return {object} user
*/
function getInfoByEmail (email) {
	for (var i=0; i<userdb.length; i++) {
		if (userdb[i].email === email) {
			return userdb[i];
		}
	}
	return null;
}
exports.getInfoByEmail = getInfoByEmail;

// ### *function*: getInfoByUID
/**
*	Returns information about the user.
*	@param {integer} uid
*	@return {object} user
*/
function getInfoByUID (uid) {
	for (var i=0; i<userdb.length; i++) {
		if (userdb[i].uid === uid) {
			return userdb[i];
		}
	}
	return null;
}
exports.getInfoByUID = getInfoByUID;

// ### *function*: lookup
/**
*	Perform email-password lookup. Returns user if login credentials match and error message if not.
*	@param {string} email
*	@param {string} password
*	@return {object} user if login credentials are correct (null if not) and appropriate error message
*/
function lookup (email, password) {
	for (var i=0; i<userdb.length; i++) {
		if (userdb[i].email === email) {
			if (userdb[i].password === password) {
				return [userdb[i], ''];
			} else if (userdb[i].password === null) {
				return [null, 'Password not yet created for this user'];
			} else {
				return [null, 'Password is incorrect'];
			}
		}
	}
	return [null, 'User not found'];
}
exports.lookup = lookup;

// ### *function*: sendpw
/**
*	Sends password via email.
*	@param {string} email address 
*	@return {string} message whether email address was found or not
*/
function sendpw (email) {
	for (var i=0; i<userdb.length; i++) {
		if (userdb[i].email === email) {
			//send email
			return true;
		}
	}
	return false;
}
exports.sendpw = sendpw;

// ### *function* checkpwExists
/**
*	Check if user has already created a password.
*	@param {integer} user id
*	@return {boolean} true if user already created a password
*/
function checkpwExists (uid) {
	var user = getInfoByUID(uid);
	if (user.password !== null) {
		return true;
	} else {
		return false;
	}
}
exports.checkpwExists = checkpwExists;

// ### *function*: createpw
/**
*	Creates password for first-time users.
*	@param {string} username
*	@param {string} new password
*/
function createpw (username, password) {
	var user = getInfoByUsername(username);
	user.password = password;
}	
exports.createpw = createpw;

// ### *function*: changepw
/**
*	Changes password of logged-in user.
*	@param {integer} user id
*	@param {string} new password
*/
function changepw (uid, newpassword) {
	var user = getInfoByUID(uid);
	user.password = newpassword;
}
exports.changepw = changepw;

// ### *function*: searchUsers
/**
*	Searches users (name and username) given search query.
*	@param {string} query phrase
*	@param {list} users partially or completely matching search query
*/
function searchUsers (query) {
	var regQuery = new RegExp(query, "gi");
	resultList = [];
	
	for (var i=0; i<userdb.length; i++) {
		if ((userdb[i].name.match(query) !== null) || (userdb[i].username.match(query) !== null)) {
			resultList.push(userdb[i]);
		}
	}
	
	return resultList;
}
exports.searchUsers = searchUsers;