import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the base URL as needed
  withCredentials: true
});

api.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('token');
  return config;
});

export const loginUser = (data: { email: string, password: string }) => {
  return api.post('/auth/login', data);
};

export const registerUser = (data: { fullName: string, email: string, password: string }) => {
  return api.post('/auth/register', data);
};

export const completeUserProfile = (data: { userId: string, department: string, team: string, role: string }) => {
  return api.post('/auth/complete-profile', data);
};

export const uploadImage = (formData: FormData) => {
  return api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProfile = () => {
  return api.get('/auth/profile');
}

export const authWithGoogle = (data: { credential: string, clientId: string }) => {
  return api.post('/auth/google', data);
}

export const searchImages = (data: { tags: string[], pageNumber: number, pageSize: number }) => {
  return api.post('/images/search', data);
};

export const autocompleteTags = (query: string) => {
  return api.get(`/tags/autocomplete?query=${query}`);
};

export const getTopTags = () => {
  return api.get('/tags/top_tags?limit=6');
}
