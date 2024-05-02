import { Request, Response } from 'express';
import AccountService from '../services/account.service';
import RequestService from '../services/request.service';

class AccountController {
  // Controller method to handle charging
  public async charge(req: Request, res: Response): Promise<void> {
    try {
      // Placeholder response for successful charging
      res.status(200).json({ message: 'Charges are successful' });
    } catch (error) {
      // Catch and handle any errors
      res.status(400).json({ error: 'Internal Server Error' });
    }
  }

  // Controller method to onboard a provider
  public async onboard(req: Request, res: Response): Promise<void> {
    try {
      // Call AccountService to onboard the provider
      const accountLink = await AccountService.onboard(req.params.providerId);
      // Respond with the account link
      res.status(200).json(accountLink);
    } catch (error) {
      // Catch and handle errors during onboarding
      console.error('Error during onboarding:', error);
      res.status(400).json({ error: error });
    }
  }

  // Controller method to get account details
  public async getAccount(req: Request, res: Response): Promise<void> {
    try {
      // Extract accountId from query parameters
      const accountId = req.query.accountId;

      // Validate presence of accountId
      if (!accountId) {
        res.status(400).json({ error: 'accountId parameter is missing' });
        return;
      }

      // Call AccountService to get account details
      const account = await AccountService.getAccount(accountId);
      // Respond with the account details
      res.status(200).json(account);
    } catch (error) {
      // Catch and handle errors during getting account details
      res.status(400).json({ error: error });
    }
  }

  public async getAccounts(req: Request, res: Response): Promise<any> {
    const { accountIds } = req.body;

    // Validate request body
    if (!accountIds || !Array.isArray(accountIds)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const accountInfo: any = {};
    // Fetch account details for each account ID
    for (const accountId of accountIds) {
      try {
        const account = await AccountService.getAccount(accountId);
        accountInfo[accountId] = account;
      } catch (error) {
        console.error('Error retrieving account details:', error);
        // If there's an error, set default values for account details
        accountInfo[accountId] = { details_submitted: false, charges_enabled: false };
      }
    }

    // Send the account details as JSON response
    res.json(accountInfo);
  }

  // Controller method to handle account updates
  public async accountUpdates(req: Request, res: Response): Promise<void> {
    try {
      // Extract account object from request body
      const account = req.body.data.object;

      // Check if account details are submitted and charges are enabled
      if (account.details_submitted && account.charges_enabled) {
        // Prepare options for HTTP request
        const options = {
          method: 'GET',
          uri: `https://ahdevelop-pr-47718.herokuapp.com/providers/${account.metadata.providerId}/stripe-callback`
        };

        // Send HTTP request to update account
        await RequestService.httpRequest(options);
      }

      // Respond with success message
      res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
      // Catch and handle errors during account updates
      console.error('Error updating account:', error);
      res.status(400).json({ error: error });
    }
  }
}

export default new AccountController();