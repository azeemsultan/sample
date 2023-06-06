import axios from 'axios';
import { authApi } from 'src/api/authApi';
import wait from 'src/utils/wait';

const axiosInstance = axios.create();

// Request interceptor for API call
axiosInstance.interceptors.request.use(async (config) => {
  config.headers.Authorization = localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : '';
  return config;
},
(error) => {
  Promise.reject(error);
});

// Response interceptor for API calls
axiosInstance.interceptors.response.use(async (response) => response, async (error) => {
  const originalRequest = error.config;
  // eslint-disable-next-line no-underscore-dangle
  if (error.response.status === 401 && !originalRequest._retry) {
    // eslint-disable-next-line no-underscore-dangle
    originalRequest._retry = true;
    console.log('calling');
    const data = await authApi?.refreshSession(localStorage.getItem('refreshToken'));
    console.log('data', data?.access_token);
    await wait(2500);
    axios.defaults.headers.common.Authorization = `Bearer ${data?.access_token}`;
    return axiosInstance(originalRequest);
  }
  return Promise.reject(error);
});

export default axiosInstance;
