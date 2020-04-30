let sqlite = require('sqlite3');
let path = require('path');

const appPath = path.resolve(__dirname, '..');
const databasePath = appPath + '/db/db.sqlite';

const ALL_BOOKS_SQL = "SELECT * FROM books WHERE user_id = ?";
const COUNT_SQL = "SELECT COUNT(*) AS 'books' FROM books;";
const DELETE_SQL = "DELETE FROM books WHERE id = ? AND user_id = ?";
const STORE_SQL = "INSERT INTO books ('user_id', 'title', 'author', 'year', 'read', 'rating', 'created_at', 'updated_at') VALUES (?,?,?,?,?,?,datetime('now'),datetime('now'))";
const UPDATE_SQL = "UPDATE books SET title = ?, author= ?, year = ?, read = ? , rating = ?, updated_at = datetime('now') WHERE id = ? and user_id = ?";


exports.all = function(userId)
{
   console.log("bookRepository::all - Enter: User ID " + userId);

   return new Promise(function (resolve, reject) {
      let db = new sqlite.Database(databasePath);
      db.all(ALL_BOOKS_SQL, [userId], function (err, rows) {
         db.close();
         if (err) {
            console.log('bookRepository::all - Promise error: ' + err);
            reject(new Error('An error occurred'));
         } else {
            if(typeof(rows) === 'undefined') {
               rows = [];
            }
            console.log("bookRepository::all - Returning books.");
            resolve(rows);
         }
      });
   });
};

exports.count = function()
{
   console.log("bookRepository::count. Enter.");

   return new Promise(function (resolve, reject) {
      let db = new sqlite.Database(databasePath);
      db.get(COUNT_SQL, function (err, row) {
         db.close();
         if (err) {
            console.log('bookRepository::count - Database error: ' + err);
            reject(new Error(err));
         } else {
            resolve(row.books);
         }
      });
   });
};

exports.delete = function(userId, bookId)
{
   console.log("bookRepository::delete - Enter: User ID " + userId + " Book ID " + bookId);

   return new Promise(function (resolve, reject) {
      let db = new sqlite.Database(databasePath);
      let stmt = db.prepare(DELETE_SQL);
      stmt.run([bookId, userId], function(err) {
         db.close();

         if(err) {
            console.log("bookRepository::delete - Error preparing query. Error: " + err);
            reject(new Error('Error: ' + err));
         } else {
            console.log("bookRepository::delete - book successfully removed.");
            resolve();
         }
      });

      stmt.finalize();
   })
};


exports.store = function(userId, title, author, year, read, rating)
{
   console.log("bookRepository::store - Enter. User Id: " + userId + " Title: " + title);

   return new Promise(function(resolve, reject) {
      let db = new sqlite.Database(databasePath);

      db.run(STORE_SQL, [userId, title, author, year, read, rating], function(err) {
         db.close();

         if(err) {
            console.log("bookRepository::store - Error preparing query. Error: " + err);
            reject(new Error('Error: ' + err));
         } else {
            console.log("bookRepository::store - book successfully stored.");
            resolve();
         }
      });
   })
};

exports.update = function(userId, bookId, title, author, year, read, rating)
{
   console.log("bookRepository::update - Enter. User Id: " + userId + " Title: " + title);

   return new Promise(function(resolve, reject) {
      let db = new sqlite.Database(databasePath);
      db.run(UPDATE_SQL, [title, author, year, read, rating, bookId, userId], function(err) {
         db.close();
         if(err) {
            console.log("bookRepository::update - Error running query. Error: " + err);
            reject(new Error('Error: ' + err));
         } else {
            console.log("bookRepository::update - book successfully updated.");
            resolve();
         }
      });
   });
};
