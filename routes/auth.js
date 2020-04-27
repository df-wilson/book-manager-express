let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');

let upload = multer();

let router = express.Router();
router.use(bodyParser.json());

let authController = require('../controllers/authController');

router.post('/register', upload.array(), authController.register);
router.post('/login', upload.array(), authController.login);
router.post('/logout', upload.array(), authController.logout);

module.exports = router;
 
