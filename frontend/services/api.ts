import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    // @ts-ignore
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

export default api;