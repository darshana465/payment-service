import { Request, Response } from 'express';
import StripeService from '../services/stripe.service';
import RequestService from '../services/request.service';
import { PaymentProcessor } from '../lib/payment-processor';
const stripe = require('stripe')('sk_test_51O0pqvKonAbBLC7krfo6HqpSiDU44XM4wY0JhrvganxzHbDkLefyZkCCatw1mUxcAnbdEmB6Uf2AkngtvruqPR9u00gdi3BhBp');


class PaymentController {
  public async charge(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({message: 'charges are succcessfull'});
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async onboard(req: Request, res: Response): Promise<void> {
    try {
      console.log(req);
      const paymentProcessor = new PaymentProcessor();
      const accountLink = await paymentProcessor.onboard(req.params.providerId);
      console.log(accountLink);
      res.status(200).json(accountLink);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async accountUpdates(req: Request, res: Response): Promise<void> {
    try {
      // const eventLog = StripeService.getEvent(req.headers['stripe-signature'], req.body);
      console.log(req);
      console.log(res);
      const account = req.body.data.object;
      if (account.details_submitted && account.charges_enabled) {
        const options = { method: 'POST', uri: `http:localhost:3000/providers/${account.meta.providerId}/stripe-callback`}
        await RequestService.httpRequest(options);
      }
      res.status(200).json({message: 'Account updated successfully'});
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async createPaymentIntent(req: Request, res: Response): Promise<void> {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
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
  }

  public async stripeCallback(req: Request, res: Response): Promise<void> {
    try {
      const paymentProcessor = new PaymentProcessor();
      const account = await paymentProcessor.getAccount(req.query.providerId);
      if (account.details_submitted && account.charges_enabled) {
        const options = { method: 'POST', uri: `${process.env.RAILS_SERVER}/providers/${account.meta.providerId}/stripe-callback`};
        await RequestService.httpRequest(options);
      }
      res.status(200).json({message: 'Account updated successfully'});
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new PaymentController();