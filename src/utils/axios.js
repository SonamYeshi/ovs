/**
 * axios setup to use mock service
 */

import axios from 'axios';
import { clearAuthTokens, setAuthTokens } from './auth-storage';

const axiosServices = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //
axiosServices.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('serviceToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshTokenStored = localStorage.getItem('refreshToken');

        // Avoid retrying the refresh token request
        const isRefreshCall = originalRequest.url.includes('/api/auth/refreshtoken');

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            // const refreshTokenStored = localStorage.getItem('refreshToken');
            if (!refreshTokenStored) {
                console.error('No refresh token found. Redirecting to login.');
                window.location.pathname = '/login';
                return Promise.reject(error);
            }

            try {
                const response = await axios.post('http://localhost:8080/api/auth/refreshtoken', {
                    refreshToken: refreshTokenStored
                });
                const { accessToken, refreshToken, user } = response.data;

                await clearAuthTokens();
                await setAuthTokens(accessToken, refreshToken, user);

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosServices(originalRequest);
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                await clearAuthTokens();
                window.location.pathname = '/login';
                return Promise.reject(refreshError);
            }
        }
        // return Promise.reject(error.response?.data || 'Request failed');

        // If refresh itself failed (or something else), don't loop
        if (isRefreshCall && error.response?.status === 401) {
            console.error('Refresh endpoint returned 401. Logging out.');
            await clearAuthTokens();
            window.location.pathname = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosServices;

export const fetcher = async (args) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosServices.get(url, { ...config });

    return res.data;
};
