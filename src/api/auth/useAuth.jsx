import axios from 'axios';
import { backdropPop, backdropPush } from '../../store/requestapi/requestApiSlice';

export const useAuth = (dispatch) => {

    const authApi = axios.create({
        baseURL: 'http://soapp_laravel.temposolutions.co/'
    });

    authApi.interceptors.request.use(
        (config) => {
            dispatch(backdropPush(config.url));
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

    authApi.interceptors.response.use((response) => {
        const {data: {message}} = response;
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
