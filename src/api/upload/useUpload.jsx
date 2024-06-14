import axios from 'axios';
import { backdropPop, backdropPush } from '../../store';

export const useUpload = (dispatch) => {
    const uploadApi = axios.create({
        baseURL: 'http://soapp_laravel.thinkwg.com/'
        //baseURL: 'http://127.0.0.1:8080/'        
    });

    uploadApi.interceptors.request.use(
        (config) => {
            dispatch(backdropPush(config.url));
            const token = localStorage.getItem(`${window.location.hostname}`);
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
        // Comentado para que no haga tanto ruido en el Front
        const { data: { type } } = response;
        dispatch(backdropPop(
            {
                message: null,
                alert: null
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
