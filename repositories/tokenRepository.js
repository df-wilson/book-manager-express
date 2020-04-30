let sqlite = require('sqlite3');

let path = require('path');
const appPath = path.resolve(__dirname, '..');
const databasePath = appPath + '/db/db.sqlite';

const INSERT_SQL = "INSERT INTO tokens (user_id, token, expires) VALUES (?,?,datetime('now'))";
const FIND_TOKEN_SQL = "SELECT token FROM tokens WHERE user_id = ?";
const REMOVE_TOKEN_SQL = "DELETE FROM tokens WHERE token = ?";
const TOKEN_EXISTS_SQL = "SELECT 1 FROM tokens WHERE token = ?";
const USER_ID_SQL = "SELECT user_id FROM tokens where token = ?";

exports.create = function(userId)
{
   console.log("tokenRepository::create - userId is: " + userId);

   return new Promise(function (resolve, reject) {
      getTokenForUserId(userId)
         .then(function(token) {
            if(token) {
               console.log("tokenRepository::create - Existing token: " + token);
               resolve(token);
            } else {
               token = generateToken(userId);
               console.log("tokenRepository::create - New token: " + token);

               // Save token to database. Don't need to wait for result.
               let db = new sqlite.Database(databasePath);
               db.run(INSERT_SQL, [ userId, token], function (err, row) {
                  db.close();
               });

               resolve(token);
            }
         })
         .catch(function() {
            reject(new Error('Token creation failed.'));
         });
   })
};

exports.getUserIdForToken = function(token)
{
   console.log("tokenRepository::getUserIdForToken. Token: " + token);

   return new Promise(function (resolve, reject)
   {
      let db = new sqlite.Database(databasePath);
      db.get(USER_ID_SQL, [token], function (err, row) {
         db.close();

         if (err) {
            console.log('tokenRepository::getUserIdForToken - Promise error: ' + err);
            reject(new Error('Error' + err));
         } else {
            console.log("tokenRepository::getUserIdForToken - User Id: " + row.user_id);
            resolve(row.user_id);
         }
      });
   });
};

exports.removeToken = function(token)
{
   console.log("tokenRepository::removeToken - Token: " + token);

   return new Promise(function (resolve, reject)
   {
      let db = new sqlite.Database(databasePath);
      db.run(REMOVE_TOKEN_SQL, [token], function (err, row) {
         db.close();

         if (err) {
            console.log('tokenRepository::removeToken - Leave. Promise error: ' + err);
            reject(new Error('An error occurred removing token'));
         } else {
            let token = 0;
            if(row) {
               token = row.token;
            }
            console.log("tokenRepository::removeToken - Leave. Token removed");
            resolve();
         }
      });
   });
};

function getTokenForUserId(userId) {
   console.log("tokenRepository::getTokenForUserId - Enter. User Id: " + userId);

   return new Promise(function (resolve, reject)
   {
      let db = new sqlite.Database(databasePath);
      db.get(FIND_TOKEN_SQL, [userId], function (err, row) {
         db.close();
         
         if (err) {
            console.log('tokenRepository::getTokenForUserId - Leave. Promise error: ' + err);
            reject(new Error('An error occurred'));
         } else {
            let token = 0;
            if(row) {
               token = row.token;
            }
            console.log("tokenRepository::getTokenForUserId - Leave. Row " + token);
            resolve(token);
         }
      });
   });
}

function generateToken(userId)
{
   let max = Number.MAX_SAFE_INTEGER;
   let min = max/2;
   return Math.floor(Math.random() * (max - min + 1) + min).toString(16)+userId.toString();
}
