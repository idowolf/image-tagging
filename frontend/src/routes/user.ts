import api from "../services/api";

/**
 * Logs in a user with the provided email and password.
 * @param data - An object containing the user's email and password.
 * @returns A Promise that resolves to the response from the server.
 */
export const loginUser = (data: { email: string, password: string }) => {
  return api.post('/auth/login', data);
};

/**
 * Registers a new user.
 * @param data - The user data including fullName, email, and password.
 * @returns A Promise that resolves to the result of the registration request.
 */
export const registerUser = (data: { fullName: string, email: string, password: string }) => {
  return api.post('/auth/register', data);
};

/**
 * Completes the user's profile by sending the provided data to the server.
 * @param data - The user profile data.
 * @param data.userId - The ID of the user.
 * @param data.department - The department of the user.
 * @param data.team - The team of the user.
 * @param data.role - The role of the user.
 * @returns A Promise that resolves to the response from the server.
 */
export const completeUserProfile = (data: { userId: string, department: string, team: string, role: string }) => {
  return api.post('/auth/complete-profile', data);
};

/**
 * Retrieves the user profile from the server.
 * @returns {Promise<any>} A promise that resolves to the user profile data.
 */
export const getProfile = () => {
  return api.get('/auth/profile');
}

/**
 * Authenticates the user with Google.
 * @param data - The authentication data.
 * @param data.credential - The user's credential.
 * @param data.clientId - The Google client ID.
 * @returns A Promise that resolves to the authentication response.
 */
export const authWithGoogle = (data: { credential: string, clientId: string }) => {
  return api.post('/auth/google', data);
}