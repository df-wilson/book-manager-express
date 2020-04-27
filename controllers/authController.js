let tokenRepository = require("../repositories/tokenRepository");
let authRepository = require("../repositories/authRepository");

exports.login = function(req, res)
{
   console.log("authController::login - request body: " + JSON.stringify(req.body));

   const errors = validateLogin(req.body.email, req.body.password);

   if(errors.length != 0) {
      let data = {
         msg: "invalid data",
         token: 0
      };

      console.log("authController::login - Leave. Invalid login data: " + JSON.stringify(errors));
      res.status(400).send(data);
      return;
   }

   authRepository.login(req.body.email, req.body.password)
      .then(function(id)
      {
         console.log("in authController::login. Id value is: " + id);

         if(id == 0) {
            let data = {
               msg: "unauthorized",
               token: 0
            };
            console.log("authController::login - Leave. User not found." + JSON.stringify(data));
            res.status(401).send(data);
         } else {
            tokenRepository.create(id)
               .then(function (token)
               {
                  // Send the results to the client
                  let data = {
                     msg: "ok",
                     token: token
                  };
                  console.log("authController::login callback - Leave" + JSON.stringify(data));
                  res.status(200).send(data);
               })
               .catch(function (error)
               {
                  // Send the results to the client
                  let data = {
                     msg: "error creating token.",
                     token: 0
                  };
                  console.log("authController::login callback - Leave. Error creating token: " + JSON.stringify(error));
                  res.status(500).send(data);
               });
         }
      })
      .catch(function(error) {
         console.log("in authController::login - error: " + error);
         res.status(500).send(data);
      });
};

exports.logout = function(req, res)
{
   console.log("in authController::logout - Enter. Request body: " + JSON.stringify(req.body));

   // Send the results to the client
   let data = {
      msg: "not found"
   };

   if(req.body.token) {
      tokenRepository.removeToken(req.body.token)
         .then(function()
         {
            data.msg = "ok";

            res.status(200).send(data);
         })
         .catch(function(error)
         {
            data.msg = error;

            res.status(400).send(data);
         });
   } else {
      data.msg = "token required";
      res.status(400).send(data);
   }

};

exports.register = function(req, res)
{
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
   
   console.log("In authController::register - name:" + name + ", email: " + email + ", Password: " + password);

   // Send the results to the client
   let data = {
      msg: "",
      token: 0
   };

   const errors = validateRegistration(name, email, password);
   if(errors.length > 0) {
      console.log("In authController::register - Validation error: " + JSON.stringify(errors));
      data.msg = errors.message;
      res.status(400).send(data);
   } else {
      authRepository.register(name, email, password)
         .then(function(token) {
            data.message = "ok";
            data.token = token;
            res.status(200).send(data);
         })
         .catch(function (error) {
            data.message = error;
            data.token = 0;
            res.status(500).send(data);
         });
   }
};

/**
 * Validate the registration data. Returns an empty array if the
 * data validates, or an array of error messages.
 */
function validateRegistration(name, email, password)
{
  let errors = [];

   if(!name || name.name === 0) {
      errors.push("name must have a value.");
   }
   else if(name.length > 255) {
      errors.push("name field must be less than 256 characters.");
   }

   if(!email || email.length === 0) {
      errors.push("email must have a value.");
   }
   else if(email.length > 255) {
      errors.push("email field must be less than 256 characters.");
   }

   if(!password || password.length === 0) {
      errors.push("password must have a value.");
   }
   else if(password.length > 255) {
      errors.push("password field must be less than 256 characters.");
   }

   return errors;
}

function validateLogin(email, password)
{
   let errors = [];

   if(!email || email.length === 0) {
      errors.push("email must have a value.");
   }
   else if(email.length > 255) {
      errors.push("email field must be less than 256 characters.");
   }

   if(!password || password.length === 0) {
      errors.push("password must have a value.");
   }
   else if(password.length > 255) {
      errors.push("password field must be less than 256 characters.");
   }

   return errors;
}
