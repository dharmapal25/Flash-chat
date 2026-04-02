import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const apiService = {
  register: async (userData) => {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post('/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axiosInstance.post('/logout', {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post('/refresh-token');
    return response.data;
  },

  // Protected API calls with auth middleware
  fetchWithAuth: async (endpoint, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    try {
      let response = await axiosInstance({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...options.headers,
        },
      });

      return response.data;
    } catch (error) {
      // If token expired, refresh it
      if (error.response?.status === 401) {
        const refreshResponse = await apiService.refreshToken();
        if (refreshResponse.accessToken) {
          accessToken = refreshResponse.accessToken;
          localStorage.setItem('accessToken', accessToken);

          const response = await axiosInstance({
            url: endpoint,
            method: options.method || 'GET',
            data: options.data,
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              ...options.headers,
            },
          });

          return response.data;
        }
      }
      throw error;
    }
  },
};

export default apiService;
