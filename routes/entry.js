var users = require('../lib/users');
var online = {};
exports.online = online;

// ### login
/**
*	Displays welcome page.
*	Includes following options: login, retrive password, create new password for first time users.
*	Also gives a brief description of the project.
*/
exports.login = function(req, res) {
	var authmessage = req.flash('userAuth') || '';
	
	var user = req.session.user;
	if ((user !== undefined) && (online[user.uid] !== undefined)) {
		res.redirect('/home/' + user.username);
	} else {
		res.render('login', { title: 'Welcome to OLIVE',
							message : authmessage
					});
	}
};

// ### userAuth
/**
*	Handles user login authentication.
*	User must enter correct email-password combination. Redirects user to his/her home page upon successful login.
*/
exports.userAuth = function(req, res) {
	var user = req.session.user;
	if ((user !== undefined) && (online[user.uid] !== undefined)) {
		res.redirect('/home/' + user.username);
	} else {
		var loginEmail = req.body.loginEmail;
		var password = req.body.password;
		if ((loginEmail === '') || (password === '')) {
			req.flash('userAuth', 'Enter both email and password');
			res.redirect('/');
		} else {
			var user = users.lookup(loginEmail, password);
			if (user[0] !== null) {
				req.session.user = user[0];
				online[user[0].uid] = user[0];
				res.redirect('/home/' + user[0].username);
			} else {
				req.flash('userAuth', user[1]);
				res.redirect('/');
			}
		}
	}
};

// ### logout
/**
*	Logouts user and redirects to welcome/login page.
*/
exports.logout = function(req, res) {
	var user = req.session.user;
	if (user === undefined || online[user.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
		return;
	}
	if (online[user.uid] !== undefined) {
		delete online[user.uid];
	}
	delete req.session.user;
	req.flash('userAuth', 'Successfully logged out');
	res.redirect('/');
};

// ### forgotpw
/**
*	Renders page to enter email to retrive password.
*/
exports.forgotpw = function(req, res) {
	var forgotpwmessage = req.flash('forgotpw') || '';
	res.render('forgotpw', { title: 'Forgot Password',
						message: forgotpwmessage
					});
};

// ### forgotpwProcess
/**
*	Sends password to user (if exists) via email.
*/
exports.forgotpwProcess = function(req, res) {
	var email = req.body.email;
	if (users.sendpw(email)) {
		req.flash('userAuth', 'Password has been sent to ' + email);
		res.redirect('/');
	} else {
		req.flash('forgotpw', 'Email not found.');
		res.redirect('/forgotpw');
	}
};

// ### resetpw
/**
*	Renders page for users to change his/her password. User must be logged in.
*/
exports.resetpw = function(req, res) {
	var resetpwmessage = req.flash('resetpw') || '';
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		res.render('resetpw', { title: 'Change Password',
						loggedInUser: loggedInUser.username,
						message: resetpwmessage
					});
	}
};

// ### resetpwProcess
/**
*	Performs check if entered passwords match. Redirects to resetpw page if not so user can try again.
*	Only changes password if entered passwords match.
*/
exports.resetpwProcess = function(req, res) {
	var loggedInUser = req.session.user;
	if (loggedInUser === undefined || online[loggedInUser.uid] === undefined) {
		req.flash('userAuth', 'Not logged in!');
		res.redirect('/');
	} else {
		if (req.body.password1 === req.body.password2) {
			users.changepw(loggedInUser.uid, req.body.password1);
			req.flash('resetpw', 'Password changed successfully!');
			res.redirect('/' + req.params.username + '/resetpw');
		} else {
			req.flash('resetpw', 'Passwords entered must match');
			res.redirect('/' + req.params.username + '/resetpw');
		}
	}
};

// ### createpw
/**
*	Renders page for first-time users to create a password.
*/
exports.createpw = function(req, res) {
	var user = users.getInfoByEmail(req.body.regEmail);
	if (user !== null) {
		if (users.checkpwExists(user.uid)) {
			req.flash('userAuth', 'Password already created for this user! Click on Forgot Password if you can\'t remember your password.');
			res.redirect('/');
		} else {
			var name = user.name;
			var email = user.email;
			var username = user.username;
			var spireid = user.spireid;
			res.render('createpw', { title: 'Create Password',
							message: '',
							name: name,
							email: email,
							username: username,
							spireid: spireid
						});
		}
	} else {
		req.flash('userAuth', 'Email not found!');
		res.redirect('/');
	}
};

// ### createpwProcess
/**
*	Checks if entered passwords match. Redirects user to welcome/login page upon successful password creation so they can try logging in.
*/
exports.createpwProcess = function(req, res) { 
	if (req.body.password1 !== req.body.password2) {
		var user = users.getInfoByUsername(req.body.regUsername);
		res.render('createpw', { title: 'Create Password',
						message: 'Passwords entered must match.',
						name: user.name,
						email: user.email,
						username: user.username,
						spireid: user.spireid
					});
	} else {
		users.createpw(req.body.regUsername, req.body.password1);
		req.flash('userAuth', 'Successfully created password! You may now log in.');
		res.redirect('/');
	}
};