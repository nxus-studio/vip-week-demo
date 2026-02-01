import { CustomerBook } from '../src/customers';

describe('customers', () => {
  it('registers with a normalized email', () => {
    const book = new CustomerBook();
    const c = book.register('  Ana ', 'ANA@Example.com');
    expect(c.email).toBe('ana@example.com');
    expect(c.name).toBe('Ana');
    expect(c.tier).toBe('standard');
  });
  it('rejects a bad email', () => {
    expect(() => new CustomerBook().register('Ana', 'not-an-email')).toThrow('email');
  });
  it('promotes to gold', () => {
    const book = new CustomerBook();
    const c = book.register('Ana', 'ana@example.com');
    expect(book.promote(c.id).tier).toBe('gold');
  });
});
