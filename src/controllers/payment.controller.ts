import { Request, Response } from 'express';
import PaymentService from '../services/payment.service';
import RequestService from '../services/request.service';

class PaymentController {
  // Controller method to handle charging
  public async charge(req: Request, res: Response): Promise<void> {
    try {
      // Placeholder response for successful charging
      res.status(200).json({ message: 'Charges are successful' });
    } catch (error) {
      // Catch and handle any errors
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Controller method to authorize and confirm payment
  public async authorizeAndConfirmPayment(req: Request, res: Response): Promise<void> {
    try {
      // Call PaymentService to authorize and confirm payment
      const paymentIntent = await PaymentService.authorizeAndConfirmPayment(req.body);
      // Respond with the payment intent
      res.status(200).json(paymentIntent);
    } catch (error) {
      // Catch and handle errors during authorization and confirmation
      console.error('Error while authorizing and confirming payment:', error);
      res.status(400).json({ error: error });
    }
  }

  // Controller method to capture payment
  public async capturePayment(req: Request, res: Response): Promise<void> {
    try {
      // Extract paymentIntentId from request body or query parameters
      const paymentIntentId = req.body.paymentIntentId || req.query.paymentIntentId;

      // Validate presence of paymentIntentId
      if (!paymentIntentId) {
        res.status(400).json({ error: 'PaymentIntent ID is required' });
        return;
      }

      // Call PaymentService to capture payment
      const capturedPaymentIntent = await PaymentService.capturePayment(paymentIntentId);
      // Respond with the captured payment intent
      res.status(200).json(capturedPaymentIntent);
    } catch (error) {
      // Catch and handle errors during payment capture
      console.error('Error while capturing payment:', error);
      res.status(400).json({ error });
    }
  }

  // Controller method to initiate payout
  public async initiatePayout(req: Request, res: Response): Promise<void> {
    try {
      // Extract amount, currency, and destination from request body
      const { amount, currency, destination } = req.body;

      // Validate presence of required parameters
      if (!amount || !currency || !destination) {
        res.status(400).json({ error: 'Amount, currency, and destination are required' });
        return;
      }

      // Call PaymentService to initiate payout
      const payout = await PaymentService.initiatePayout(amount, currency, destination);
      // Respond with the initiated payout details
      res.status(200).json(payout);
    } catch (error) {
      // Catch and handle errors during payout initiation
      console.error('Error while initiating payout:', error);
      res.status(400).json({ error });
    }
  }

  // Controller method to handle account updates
  public async paymentUpdates(req: Request, res: Response): Promise<void> {
    try {
      const paymentIntent = req.body.data.object;

      // Prepare options for HTTP request
      const options = {
        method: 'POST',
        uri: `${process.env.RAILS_SERVER}/stripe/payments`,
        body: {
          paymentIntent: paymentIntent,
          event: req.body.event
        }
      };

      // Send HTTP request to update account
      await RequestService.httpRequest(options);

      // Respond with success message
      res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
      // Catch and handle errors during account updates
      console.error('Error updating account:', error);
      res.status(400).json({ error: error });
    }
  }
}

export default new PaymentController();
