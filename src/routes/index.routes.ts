import express from 'express';
import PaymentController from '../controllers/payment.controller';
import AccountController from '../controllers/account.controller';

const router = express.Router();

// Define CRUD routes and validation
router.get('/charge', AccountController.charge); // test end point

router.get('/:providerId/onboarding', AccountController.onboard); // Endpoint for onboarding

router.post('/account', AccountController.accountUpdates); // Endpoint for updating account

router.post('/accounts', AccountController.accountUpdates); // Endpoint for updating account

router.get('/account', AccountController.getAccount); // Endpoint for getting account details

router.post('/authorize', PaymentController.authorizeAndConfirmPayment); // Endpoint for authorizing and confirming payment

router.post('/capture-payment', PaymentController.capturePayment); // Endpoint for capturing payment

router.post('/payout', PaymentController.initiatePayout); // Endpoint for initiating payout

export default router;