// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  const account1 = getBankAccount(100);
  const account2 = getBankAccount(200);
  test('should create account with initial balance', () => {
    expect(account1).toBeInstanceOf(BankAccount);
    expect(account1.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account1.withdraw(200)).toThrow(InsufficientFundsError);
    expect(account1.getBalance()).toBe(100);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account1.transfer(200, account2)).toThrow(
      InsufficientFundsError,
    );
    expect(account1.getBalance()).toBe(100);
    expect(account2.getBalance()).toBe(200);
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account1.transfer(200, account1)).toThrow(TransferFailedError);
    expect(account1.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    expect(account1.deposit(200)).toBeInstanceOf(BankAccount);
    expect(account1.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    expect(account1.withdraw(150)).toBeInstanceOf(BankAccount);
    expect(account1.getBalance()).toBe(150);
  });

  test('should transfer money', () => {
    expect(account1.transfer(50, account2)).toBeInstanceOf(BankAccount);
    expect(account1.getBalance()).toBe(100);
    expect(account2.getBalance()).toBe(250);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 50);
    await expect(account1.fetchBalance()).resolves.toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 50);
    await account1.synchronizeBalance();
    expect(account1.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 0);
    await expect(account1.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
