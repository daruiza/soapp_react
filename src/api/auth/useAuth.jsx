import axios from 'axios';
import { backdropPop, backdropPush } from '../../store';

export const useAuth = (dispatch) => {

    const authApi = axios.create({
        // baseURL: 'http://soapp_laravel.temposolutions.co/'       
        baseURL: 'http://127.0.0.1:8080/'
        // 3015909420
    });

    authApi.interceptors.request.use(
        (config) => {
            dispatch(backdropPush(config.url));
            const token = localStorage.getItem(`${window.location.hostname}`);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    authApi.interceptors.response.use((response) => {
        const { data: { message } } = response;
        dispatch(backdropPop(
            {
                message: `${message}`,
                alert: 'success'
            }
        ));
        return response;
    }, (error) => {
        dispatch(backdropPop({
            message: error?.response?.data?.message ?? 'Erorr Inesperado',
            alert: 'error'
        }));
        return Promise.reject(error)
    })

    return {
        authApi
    }
}
