
let sqlite = require('sqlite3');

let path = require('path');
const appPath = path.resolve(__dirname, '..');
const databasePath = appPath + '/db/db.sqlite';

/**
 * Get all book data from the data store. The book data is returned as a JSON string in
 * the form:
 * {"message":"OK", "books":[{"author":"[string]]","id":[int],"rating":[int],"read":[bool],"title":"[string]","year":"[string]"},...]}
 *
 */
exports.index = function(req, res) {

  let db = new sqlite.Database(databasePath);

  db.all('SELECT * from Books', (error, rows) => {
    if(error) return console.log(error);
    const data = rows;
    
    db.close();

    // Send the data to the client
    let result = {
      msg: "OK",
      books: data
    };

    res.send(result);
  });
};

/**
 * Get the data for a single book from the data store. The book data is returned as a JSON string in
 * the form:
 * {"message":"OK", "books":[{"author":"[string]]","id":[int],"rating":[int],"read":[bool],"title":"[string]","year":"[string]"}]}
 */
exports.getById = function(req, res) {
  let db = new sqlite.Database(databasePath);

  const id = parseInt(req.params.id);

  db.all('SELECT * from Books where id=?', id, (error, rows) => {
    let msg = "Error retrieving book.";
    let data = null;

    if(error) {
      data = [];
    } else {
      data = rows;
      if(data.length === 0) {
        msg = "Book not found."
      } else {
        msg = "OK";
      }
    }

    db.close();

    // Send the data to the client
    let result = {
      msg: msg,
      books: data
    };

    res.send(result);
  });
};

/**
 * Save the data for a new book in the data store. The book data is expected to be in JSON format
 * in the form:
 * {"title":"[title]","author":"[author]","year":"[year]","read":[bool],"rating":[0 to 5]}
 */
exports.store = function(req, res)
{
  const title = req.body.title;
  const author = req.body.author;
  const year = req.body.year;
  const read = req.body.read;
  const rating = req.body.rating;

  let message = "Unknown Error";

  const errors = validate(title, author, year, read, rating);

  if(errors.length) {
    message = "Errors: Book not saved.";
    res.statusCode = 401;
  } else {

    let db = new sqlite.Database(databasePath);
    const sql = "INSERT INTO books ('title', 'author', 'year', 'read', 'rating', 'created_at', 'updated_at') VALUES (?,?,?,?,?,?,?)";
    let stmt = db.prepare(sql);
    stmt.run(title, author, year, read, rating);
    stmt.finalize();
    db.close();
    message = "Book Saved.";
  }

  // Send the results to the client
  let data = {
    msg: message,
    errors: errors
  };

  res.send(data);
};

/**
 * Updates an existing book in the data store. The book data is expected to be in JSON
 * format in the form:
 * {"title":"[title]","author":"[author]","year":"[year]","read":[bool],"rating":[0 to 5]}
 */
exports.update = function(request, result)
{
  const id = parseInt(request.params.id);
  const title = request.body.title;
  const author = request.body.author;
  const year = request.body.year;
  const read = request.body.read;
  const rating = request.body.rating;

  let message = "Unknown Error";

  const errors = validate(title, author, year, read, rating);

  if(errors.length) {
    message = "Errors: Book not saved.";
    result.statusCode = 401;
  } else {
    const sql = "UPDATE books SET title = ?, author= ?, year = ?, read = ? , rating = ? WHERE id = ?";
    let db = new sqlite.Database(databasePath);
    let stmt = db.prepare(sql);
    stmt.run(title, author, year, read, rating, id);
    stmt.finalize();
    db.close();
    message = "Book Saved.";
  }

  // Send the results to the client
  let data = {
    msg: message,
    errors: errors
  };

  result.send(data);
};

/**
 * Remove a record from the data store.
 */
exports.delete = function(request, result)
{
  const id = parseInt(request.params.id);

  const sql = "DELETE FROM books WHERE id = ?";
  let db = new sqlite.Database(databasePath);
  let stmt = db.prepare(sql);
  stmt.run(id);
  stmt.finalize();
  db.close();

  // Send the results to the client
  let data = {
    msg: "OK",
    errors: []
  };

  result.send(data);
};

/**
 * Validate the book data before saving/updating. Returns an empty array if the
 * data validates, or an array of error messages.
 */
function validate(title, author, year, isRead, rating)
{
  let errors = [];

    if(!title || title.length === 0) {
      errors.push("title must have a value.");
    }
    else if(title.length > 255) {
      errors.push("title field must be less than 256 characters.");
    }

  if(!author || author.length === 0) {
    errors.push("author must have a value.");
  }
  else if(author.length > 255) {
    errors.push("author field must be less than 256 characters.");
  }

  let intYear = parseInt(year);
  if(!year || intYear < 0 || intYear > 3000) {
    errors.push("year must be between 0 and 3000.");
  }

  if(typeof(isRead) !== "boolean" || typeof(isRead) !== "number") {
    errors.push("read must be boolean value")
  }

  let intRating = parseInt(rating);
  if(!rating || intRating < 0 || intRating > 5) {
    errors.push("rating must be between 0 and 5");
  }

  return errors;
}