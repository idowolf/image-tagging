/**
 * Checks if an email is valid, i.e., has the format of an email address.
 * @param email - The email to be validated.
 * @returns A boolean indicating whether the email is valid or not.
 */
export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
/**
 * Checks if a password is valid, i.e., has at least 5 characters.
 * @param password - The password to be validated.
 * @returns A boolean indicating whether the password is valid or not.
 */
export const isPasswordValid = (password: string) => password.length >= 5;
