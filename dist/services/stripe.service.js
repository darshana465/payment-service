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
Object.defineProperty(exports, "__esModule", { value: true });
class StripeService {
    constructor() {
        this.stripe = require('stripe')('sk_test_51O0pqvKonAbBLC7krfo6HqpSiDU44XM4wY0JhrvganxzHbDkLefyZkCCatw1mUxcAnbdEmB6Uf2AkngtvruqPR9u00gdi3BhBp');
    }
    onboard(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.stripe.accounts.create({
                    country: 'US',
                    type: 'express',
                    business_type: 'individual',
                    metadata: {
                        providerId
                    }
                });
                console.log(account);
                const accountLink = yield this.stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: `https://1e87-2405-201-3016-b1aa-d5a3-6437-9b7-f86a.ngrok-free.app/api/stripe-callback`,
                    return_url: `https://1e87-2405-201-3016-b1aa-d5a3-6437-9b7-f86a.ngrok-free.app/api/stripe-callback`,
                    type: 'account_onboarding',
                });
                accountLink.account_id = account.id;
                return accountLink;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getEvent(signature, body) {
        const endpointSecret = process.env.ENDPOINT_SECRET;
        const sig = signature;
        const event = this.stripe.webhooks.constructEvent(body, sig, endpointSecret);
        return event;
    }
    getAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.stripe.accounts.retrieve(accountId);
                console.log(account);
                return account;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new StripeService();
//# sourceMappingURL=stripe.service.js.map