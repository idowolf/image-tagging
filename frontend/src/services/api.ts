import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      alert('You are not authenticated. Please login to continue.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 429) {
      localStorage.removeItem('token');
      alert('Too many requests. Please slow down!');
    }
    return Promise.reject(error);
  }
);

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

export const searchImages = (data: { tags: Set<string>, pageNumber: number, pageSize: number }) => {
  return api.post('/images/search', { tags: Array.from(data.tags), pageNumber: data.pageNumber, pageSize: data.pageSize });
};

export const autocompleteTags = (query: string) => {
  return api.get(`/tags/autocomplete?query=${query}`);
};

export const getTopTags = () => {
  return api.get('/tags/top_tags?limit=6');
}

export const convertTextToTags = (data: { text: string, topTagsCount: number }) => {
  return api.post('/tags/convertTextToTags', data);
}