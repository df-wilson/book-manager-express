let express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let app = express();

/* ----- The api routes ----- */
let books = require('./routes/books');
let home = require('./routes/home');
let auth = require('./routes/auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ----- Add the api routes ----- */
app.use('/', home);
app.use('/api/v1/books', books);
app.use('/api/v1/auth', auth);

/* ----- Handle unknown requests ----- */
app.use(function(req, res, next) {
  next(createError(404));
});

/* ----- Handle Errors ----- */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
