const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');

router.post('/', creditController.createCredit);
router.get('/', creditController.getAllCredits);
router.get('/:id', creditController.getCreditById);

module.exports = router;