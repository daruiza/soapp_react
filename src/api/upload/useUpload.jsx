import axios from 'axios';
import { backdropPop, backdropPush } from '../../store/requestapi/requestApiSlice';

export const useUpload = (dispatch) => {
    const uploadApi = axios.create({
        baseURL: 'http://127.0.0.1:8080/'
        // baseURL: 'http://soapp_laravel.temposolutions.co/'
        
    });

    uploadApi.interceptors.request.use(
        (config) => {
            dispatch(backdropPush(config.url));
            const token = localStorage.getItem('accesstoken');
            config.headers['content-type'] = 'multipart/form-data';
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    uploadApi.interceptors.response.use((response) => {
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
    return { uploadApi }
}
