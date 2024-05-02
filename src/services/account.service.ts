class AccountService {
  private stripe = require('stripe')('sk_test_51O0pqvKonAbBLC7krfo6HqpSiDU44XM4wY0JhrvganxzHbDkLefyZkCCatw1mUxcAnbdEmB6Uf2AkngtvruqPR9u00gdi3BhBp');

  // Method to onboard a provider
  public async onboard(providerId: any): Promise<any> {
    try {
      // Create a new account with Stripe
      const account = await this.stripe.accounts.create({
        country: 'US',
        type: 'express',
        business_type: 'individual',
        metadata: {
          providerId
        }
      });

      // Log the created account
      console.log('Account created:', account);

      // Create an account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `https://ahdevelop-pr-47718.herokuapp.com/providers/${providerId}/stripe-refresh-callback`,
        return_url: `https://ahdevelop-pr-47718.herokuapp.com/providers/${providerId}/stripe-callback?stripe_onboarded=true`,
        type: `account_onboarding`,
      });

      // Assign the account ID to the account link object
      accountLink.account_id = account.id;

      // Return the created account link
      return accountLink;
    } catch (error) {
      // Log and rethrow any errors that occur during onboarding
      console.error('Error during provider onboarding:', error);
      throw error;
    }
  }

  // Method to retrieve account details
  public async getAccount(accountId: any): Promise<any> {
    try {
      // Retrieve the account details from Stripe
      const account = await this.stripe.accounts.retrieve(accountId);

      // Log the retrieved account details
      console.log('Account details retrieved:', account);

      // Return the retrieved account details
      return account;
    } catch (error) {
      // Log and rethrow any errors that occur during account retrieval
      console.error('Error retrieving account details:', error);
      throw error;
    }
  }
}

export default new AccountService();