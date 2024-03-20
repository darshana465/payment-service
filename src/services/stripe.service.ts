class StripeService {
  private stripe = require('stripe')('sk_test_51O0pqvKonAbBLC7krfo6HqpSiDU44XM4wY0JhrvganxzHbDkLefyZkCCatw1mUxcAnbdEmB6Uf2AkngtvruqPR9u00gdi3BhBp');

  public async onboard(providerId: any): Promise<any> {
    try {
      const account = await this.stripe.accounts.create({
        country: 'US',
        type: 'express',
        business_type: 'individual',
        metadata: {
          providerId
        }
      });
      console.log(account);

      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `https://1e87-2405-201-3016-b1aa-d5a3-6437-9b7-f86a.ngrok-free.app/api/stripe-callback`,
        return_url: `https://1e87-2405-201-3016-b1aa-d5a3-6437-9b7-f86a.ngrok-free.app/api/stripe-callback`,
        type: 'account_onboarding',
      });

      accountLink.account_id = account.id;

      return accountLink;
    } catch (error) {
      console.log(error);
    }
  }

  public getEvent(signature: any, body: any) {
    const endpointSecret = process.env.ENDPOINT_SECRET;
    const sig = signature;
    const event = this.stripe.webhooks.constructEvent(body, sig, endpointSecret);
    return event;
  }

  public async getAccount(accountId: any): Promise<any> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId);
      console.log(account);
      return account;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new StripeService();