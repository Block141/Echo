// src/api.js
import axios from 'axios';
import getCsrfToken from './csrf'; 

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

export const fetchArticles = async () => {
  try {
    const response = await api.post('/api/news/fetch_articles/', {});
    return response.data.articles;
  } catch (error) {
    console.error('Failed to fetch articles:', error.response); 
    throw new Error('Failed to fetch articles');
  }
};

export const login = async (username, password) => {
  const csrfToken = getCsrfToken(); 
  const response = await api.post('/api/users/auth/login/', { username, password }, {
    headers: {
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  });

  localStorage.setItem('accessToken', response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh);

  return response.data;
};

export default api;
