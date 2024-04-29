class PaymentService {
  private stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // Method to authorize and confirm a payment
  public async authorizeAndConfirmPayment(data: any) {
    try {
      // Create a PaymentIntent with the specified amount, currency, and payment method
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount, // Example amount, replace with actual value from data
        currency: data.currency,
        payment_method: data.payment_method,
        description: data.description,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never'
        },
        capture_method: process.env.CAPTURE_METHOD // Set capture method from environment variable
      });

      // Confirm the payment intent to authorize and confirm the payment
      const confirmedPaymentIntent = await this.stripe.paymentIntents.confirm(paymentIntent.id);

      // Log the confirmed payment intent
      console.log('Payment authorized and confirmed:', confirmedPaymentIntent);

      // Return the confirmed payment intent object
      return confirmedPaymentIntent;
    } catch (error) {
      // Log and rethrow any errors that occur during payment authorization and confirmation
      console.error('Failed to authorize and confirm payment:', error);
      throw error;
    }
  }

  // Method to capture a payment
  public async capturePayment(paymentIntentId: string) {
    try {
      // Capture the payment for the specified PaymentIntent
      const capturedPaymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);

      // Log the captured payment intent
      console.log('Payment captured:', capturedPaymentIntent);

      // Return the captured payment intent object
      return capturedPaymentIntent;
    } catch (error) {
      // Log and rethrow any errors that occur during payment capture
      console.error('Failed to capture payment:', error);
      throw error;
    }
  }

  // Method to initiate a payout
  public async initiatePayout(amount: number, currency: string, destination: string) {
    try {
      // Create a payout to the specified destination account
      const payout = await this.stripe.payouts.create({
        amount,
        currency,
        destination
      });

      // Log the initiated payout
      console.log('Payout initiated:', payout);

      // Return the payout object
      return payout;
    } catch (error) {
      // Log and rethrow any errors that occur during payout initiation
      console.error('Failed to initiate payout:', error);
      throw error;
    }
  }
}

export default new PaymentService();