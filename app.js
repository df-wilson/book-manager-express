let express = require('express');
let app = express();

/* Set up the location for static public files such as css, html, etc. */
app.use(express.static('public'));

/* ----- The api routes ----- */
let books = require('./routes/books');
let home = require('./routes/home');

/* ----- Add the api routes ----- */
app.use('/', home);
app.use('/api/v1/books', books);

/* ----- Handle unknown requests ----- */
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

/* ----- Handle Errors ----- */
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});

/* ----- Listen for requests ----- */
app.listen(3000, function() {
   console.log('App listening on port 3000');
});
