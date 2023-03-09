import axios from 'axios';
import { backdropPop, backdropPush, } from '../../store/requestapi/requestApiSlice';

export const useEmployeeReport = (dispatch) => {
    const employeereportApi = axios.create({
        // baseURL: 'http://soapp_laravel.temposolutions.co/'
        baseURL: 'http://127.0.0.1:8080/'

    });

    employeereportApi.interceptors.request.use(
        (config) => {
            dispatch(backdropPush(config.url));
            const token = localStorage.getItem(`${window.location.hostname}`);
            config.headers['content-type'] = 'application/json;charset=utf-8;multipart/form-data;';
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    employeereportApi.interceptors.response.use((response) => {
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
    return { employeereportApi }
}