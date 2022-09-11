import axios from 'axios';

const authApi = axios.create({
   baseURL: 'http://soapp_laravel.temposolutions.co/'
});

authApi.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('accesstoken');
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

export default authApi;