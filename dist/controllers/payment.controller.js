"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_service_1 = __importDefault(require("../services/request.service"));
const payment_processor_1 = require("../lib/payment-processor");
const stripe = require('stripe')('sk_test_51O0pqvKonAbBLC7krfo6HqpSiDU44XM4wY0JhrvganxzHbDkLefyZkCCatw1mUxcAnbdEmB6Uf2AkngtvruqPR9u00gdi3BhBp');
class PaymentController {
    charge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json({ message: 'charges are succcessfull' });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    onboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req);
                const paymentProcessor = new payment_processor_1.PaymentProcessor();
                const accountLink = yield paymentProcessor.onboard(req.params.providerId);
                console.log(accountLink);
                res.status(200).json(accountLink);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    accountUpdates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const eventLog = StripeService.getEvent(req.headers['stripe-signature'], req.body);
                console.log(req);
                console.log(res);
                const account = req.body.data.object;
                if (account.details_submitted && account.charges_enabled) {
                    const options = { method: 'GET', uri: `https://ahdevelop-pr-47718.herokuapp.com/providers/${account.metadata.providerId}/stripe-callback` };
                    yield request_service_1.default.httpRequest(options);
                }
                res.status(200).json({ message: 'Account updated successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    createPaymentIntent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items } = req.body;
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = yield stripe.paymentIntents.create({
                amount: 1000,
                currency: "inr",
                // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
            });
        });
    }
    stripeCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentProcessor = new payment_processor_1.PaymentProcessor();
                const account = yield paymentProcessor.getAccount(req.query.providerId);
                if (account.details_submitted && account.charges_enabled) {
                    const options = { method: 'POST', uri: `${process.env.RAILS_SERVER}/providers/${account.meta.providerId}/stripe-callback` };
                    yield request_service_1.default.httpRequest(options);
                }
                res.status(200).json({ message: 'Account updated successfully' });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new PaymentController();
//# sourceMappingURL=payment.controller.js.map