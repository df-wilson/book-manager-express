let express = require('express');
let router = express.Router();

let homeController = require('../controllers/homeController');

router.get('/', homeController.index);

module.exports = router;