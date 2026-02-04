import { assertNonEmpty, isEmail, ValidationError } from './validation';
import { nextId } from './ids';

export type Tier = 'standard' | 'gold';

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: Tier;
}

export class CustomerBook {
  private customers = new Map<string, Customer>();

  register(name: string, email: string, tier: Tier = 'standard'): Customer {
    assertNonEmpty(name, 'name');
    if (!isEmail(email)) throw new ValidationError('email is not valid');
    const customer: Customer = { id: nextId('cus'), name: name.trim(), email: email.trim().toLowerCase(), tier };
    this.customers.set(customer.id, customer);
    return customer;
  }

  get(id: string): Customer {
    const customer = this.customers.get(id);
    if (!customer) throw new Error(`Unknown customer ${id}`);
    return customer;
  }

  promote(id: string): Customer {
    const customer = this.get(id);
    customer.tier = 'gold';
    return customer;
  }

  all(): Customer[] {
    return [...this.customers.values()];
  }
}

// tiers: 'standard' | 'gold'. Gold customers are eligible for VIP promotions.
