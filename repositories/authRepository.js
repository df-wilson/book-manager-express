let sqlite = require('sqlite3');
let tokenRepository = require("../repositories/tokenRepository");

let path = require('path');
const appPath = path.resolve(__dirname, '..');
const databasePath = appPath + '/db/db.sqlite';
//let db = new sqlite.Database(databasePath);

const GET_USER_ID = "SELECT id FROM users WHERE email = ? AND password = ?";
const REGISTER_SQL = "INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?,?,?,datetime('now'),datetime('now'))";


exports.login = function(email, password)
{
   console.log("In authRepository::login - email: " + email + " password: " + password);

   return new Promise(function (resolve, reject) {
      let db = new sqlite.Database(databasePath);
      db.get(GET_USER_ID, [email, password], function(err, row) {
         db.close();
         
         if (err) {
            console.log('In authRepository::login - Promise error: ' + err);
            reject(new Error('An error occurred'));
         } else {
            let rowId = 0;
            if(row) {
               rowId = row.id;
            }

            console.log("In authRepository::login - Row ID: " + JSON.stringify(rowId));
            resolve(rowId);
         }
      });
   });
};


exports.register = function(name, email, password)
{
   console.log("In authRepository::register - " + name + " email: " + email + " password: " + password);

   return new Promise(function (resolve, reject) {
      let db = new sqlite.Database(databasePath);
      db.run(REGISTER_SQL, [name, email, password], function(err) {
         db.close();

         if(err) {
            console.log(err.message);
            console.log(JSON.stringify(err));
            reject(err.message);
         } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            console.log(`Changes ${this.changes}`);

            // Create a token
            tokenRepository.create(this.lastID)
               .then(function(token)
               {
                  console.log("Token is: " + token);
                  resolve(token);
               })
               .catch(function(error)
               {
                  reject(error);
               });
         }
      });
   });
};
