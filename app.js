
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , entry = require('./routes/entry')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  ;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/** 
*	Routes
*/


app.get('/', entry.login);
app.post('/userAuth', entry.userAuth);
app.get('/logout', entry.logout);
app.get('/forgotpw', entry.forgotpw);
app.post('/forgotpwProcess', entry.forgotpwProcess);
app.get('/:username/resetpw', entry.resetpw);
app.post('/resetpwProcess', entry.resetpwProcess);
app.post('/createpw', entry.createpw);
app.post('/createpwProcess', entry.createpwProcess);

app.get('/home/:username', routes.home);
app.get('/profile/:username', routes.profile);
app.get('/course/:courseNum', routes.course);
app.get('/lecture/:courseNum/:lectureNum', routes.lecture);

app.post('/deleteNote', routes.deleteNote);
app.post('/createNote', routes.createNote);

app.get('/searchN/:query', routes.searchN);
app.get('/searchP/:query', routes.searchP);
app.post('/searchBox', routes.searchBox);

app.get('/testModal', routes.testModal);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
