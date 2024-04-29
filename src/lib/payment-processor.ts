import { PaymentStrategy } from './payment-strategy';
import AccountService from '../services/account.service';

export class PaymentProcessor {
  private paymentStrategy: PaymentStrategy | undefined = AccountService;
  constructor(paymentStrategy?: PaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  async onboard(data: any) {
    const result = await AccountService.onboard(data);
    return result;
  }

  async getAccount(data: any) {
    return await AccountService.getAccount(data);
  }
}
