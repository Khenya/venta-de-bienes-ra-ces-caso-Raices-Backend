const express = require('express');
const router = express.Router();
const installmentController = require('../controllers/installmentController');

router.get('/credit/:creditId', installmentController.getInstallmentsByCredit);
router.put('/pay/:installmentId', installmentController.payInstallment);

router.get('/property/:propertyId', installmentController.getInstallmentsByProperty);
router.get('/property/:propertyId/summary', installmentController.getPaymentSummaryByProperty);

module.exports = router;
