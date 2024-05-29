import api from "../services/api";

export const loginUser = (data: { email: string, password: string }) => {
  return api.post('/auth/login', data);
};

export const registerUser = (data: { fullName: string, email: string, password: string }) => {
  return api.post('/auth/register', data);
};

export const completeUserProfile = (data: { userId: string, department: string, team: string, role: string }) => {
  return api.post('/auth/complete-profile', data);
};

export const getProfile = () => {
  return api.get('/auth/profile');
}

export const authWithGoogle = (data: { credential: string, clientId: string }) => {
  return api.post('/auth/google', data);
}