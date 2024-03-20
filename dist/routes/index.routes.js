"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = __importDefault(require("../controllers/payment.controller"));
const router = express_1.default.Router();
// Define CRUD routes and validation
router.get('/charge', payment_controller_1.default.charge);
router.get('/:providerId/onboarding', payment_controller_1.default.onboard);
router.post('/account', payment_controller_1.default.accountUpdates);
router.get('/stripe-callback', payment_controller_1.default.accountUpdates);
router.post('/create-payment-intent', payment_controller_1.default.createPaymentIntent);
exports.default = router;
