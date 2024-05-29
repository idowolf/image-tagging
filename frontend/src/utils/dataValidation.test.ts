import { isEmailValid, isPasswordValid } from './dataValidation';

test('validates email addresses', () => {
  expect(isEmailValid('test@example.com')).toBe(true);
  expect(isEmailValid('invalid-email')).toBe(false);
});

test('validates passwords', () => {
  expect(isPasswordValid('12345')).toBe(true);
  expect(isPasswordValid('1234')).toBe(false);
});
