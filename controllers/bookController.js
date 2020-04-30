
let bookRepository = require('../repositories/bookRepository.js');
let tokenRepository = require('../repositories/tokenRepository.js');

/**
 * Get all book data from the data store. The book data is returned as a JSON string in
 * the form:
 * {"message":"OK", "books":[{"author":"[string]]","id":[int],"rating":[int],"read":[bool],"title":"[string]","year":"[string]"},...]}
 *
 */
exports.index = function(request, result)
{
   console.log("bookController::index - Request data: " + JSON.stringify(request.query));

   tokenRepository.getUserIdForToken(request.query.token)
      .then(function (userId) {
         bookRepository.all(userId)
            .then(function(list_books) {
               console.log("bookController::index - return from database. Success.");

               let data = {
                  msg: "ok",
                  books: list_books
               };

               result.status(200).send(data);
            })
            .catch(function(error) {
               console.log("bookController::index - error: " + error);

               let data = {
                  msg: "error",
                  books: []
               };

               result.status(500).send(data);
            });
      })
      .catch(function(error)
      {
         console.log("bookController::index - Error getting user id from token. Error" + error);
         
         let data = {
            msg: "unauthorized",
            books: []
         };

         result.status(401).send(data);
      });
};


/**
 * Save the data for a new book in the data store. The book data is expected to be in JSON format
 * in the form:
 * {"title":"[title]","author":"[author]","year":"[year]","read":[bool],"rating":[0 to 5]}
 */
exports.store = function(request, result)
{
   console.log("bookController::store - Enter. Request data: " +JSON.stringify(request.body));

   // Send the results to the client
   let data = {
      msg: "Unknown error",
      errors: []
   };

   tokenRepository.getUserIdForToken(request.query.token)
      .then(function (userId) {
         const errors = validate(request.body.title,
            request.body.author,
            request.body.year,
            request.body.read,
            request.body.rating);

         if(!userId) {
            result.status(401).send("not authorized");
         } else if(errors.length) {
            console.log("bookController::store. Validate errors: " + errors);
            data.msg = "Errors: Book not saved.";
            data.errors = errors;
            result.status(400).send(data);
         } else {
            bookRepository.store(userId,
                                 request.body.title,
                                 request.body.author,
                                 request.body.year,
                                 request.body.read,
                                 request.body.rating)
               .then(function() {
                  data.msg = "Book Saved.";
                  result.status(201).send(data);
               })
               .catch(function(error) {
                  data.msg = "error saving book";
                  data.errors = [error];
                  result.status(500).send(data);
               });
         }
      })
      .catch(function(error) {
         console.log("bookController::index - error: " + error);

         data.msg = "error";
         data.errors = [error];

         result.status(500).send(data);
      });
};

/**
 * Updates an existing book in the data store. The book data is expected to be in JSON
 * format in the form:
 * {"title":"[title]","author":"[author]","year":"[year]","read":[bool],"rating":[0 to 5]}
 */
exports.update = function(request, result)
{
   console.log("bookController::update - Enter. Request data: " +JSON.stringify(request.body));

   const bookId = parseInt(request.params.id);

   tokenRepository.getUserIdForToken(request.query.token)
      .then(function (userId) {
         const errors = validate(request.body.title,
                                 request.body.author,
                                 request.body.year,
                                 request.body.read,
                                 request.body.rating);

         if(errors.length) {
            result.status(401).send("not authorized");
         } else {
            bookRepository.update(userId,
                                  bookId,
                                  request.body.title,
                                  request.body.author,
                                  request.body.year,
                                  request.body.read,
                                  request.body.rating)
               .then(function() {
                  result.status(200).send("book updated");
               })
               .catch(function(error) {
                  data.msg = "error saving book";
                  data.errors = error;
                  result.status(500).send(data);
               });
         }
      })
      .catch(function(error){
         console.log("bookController::update - error: " + error);

         let data = {
            msg: "error",
            books: []
         };

         result.status(500).send(data);
      });
};

/**
 * Remove a record from the data store.
 */
exports.delete = function(request, result)
{
  const bookId = parseInt(request.params.id);

   tokenRepository.getUserIdForToken(request.query.token)
      .then(function (userId) {
         if(userId) {
            bookRepository.delete(userId, bookId)
               .then(function() {
                  let msg = "book removed";
                  result.status(200).send(msg);
               })
               .catch(function(error){
                  console.log("bookController::delete - error: " + error);
                  result.status(500).send(error);
               });
         } else {
            console.log("bookController::delete - User not found.");
            result.status(401).send("user not authorized");
         }
      })
      .catch(function(error){
         console.log("bookController::index - error: " + error);
         result.status(500).send(error);
      });
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

  if(typeof(isRead) !== "boolean" && typeof(isRead) !== "number") {
    errors.push("read must be boolean value")
  }

  let intRating = parseInt(rating);
  if(rating && (intRating < 0 || intRating > 5)) {
    errors.push("rating must be between 0 and 5");
  }

  return errors;
}
