class AccountService {
  private stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // Method to onboard a provider
  public async onboard(providerId: any): Promise<any> {
    try {
      // Create a new account with Stripe
      const account = await this.stripe.accounts.create({
        country: process.env.COUNTRY,
        type: process.env.ACCOUNT_TYPE,
        business_type: process.env.BUSINESS_TYPE,
        metadata: {
          providerId
        }
      });

      // Log the created account
      console.log('Account created:', account);

      // Create an account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.RAILS_SERVER}/providers/${providerId}/stripe-refresh-callback`,
        return_url: `${process.env.RAILS_SERVER}/providers/${providerId}/stripe-callback`,
        type: `${process.env.ACCOUNT_LINK_TYPE}`,
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