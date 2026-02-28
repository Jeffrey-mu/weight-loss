import axios from 'axios';

// Create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use environment variable or default to /api
  timeout: 10000 // Request timeout
});

// Request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// Response interceptor
service.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('Response Error:', error);
    if (error.response) {
      if (error.response.status === 401) {
        // Handle 401 Unauthorized
        // Only redirect if we are not already on login/register page to avoid loops if checkLoggedIn fails
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
           localStorage.removeItem('token');
           // window.location.href = '/login'; // Optional: auto redirect
        }
      }
    }
    return Promise.reject(error);
  }
);

export default service;
