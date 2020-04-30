let express = require('express');
let bodyParser = require('body-parser');
let multer = require('multer');

let upload = multer();

let router = express.Router();
router.use(bodyParser.json());

let bookController = require('../controllers/bookController');

router.get('/', bookController.index);

router.post('/', upload.array(), bookController.store);

router.put('/:id', bookController.update);

router.delete('/:id', bookController.delete);

module.exports = router;