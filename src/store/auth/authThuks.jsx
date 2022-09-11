

import authApi from "../../api/auth/auth";
import { checkingCredentials, logout, login } from "./";

export const checkingAuthentication = (email, password) => {
    return (dispatch) => {
        dispatch(checkingCredentials());
        authApi.post('api/auth/login', {
            email: email,
            password: password
        }).then(({ data }) => {
            localStorage.setItem('accesstoken', data.access_token);
            authApi.get('api/auth/user').then((user) => {
                dispatch(login({ user: user.data, auht: data }));
            })
        }).catch((error) => {
            // Falta mostrar el error
            localStorage.removeItem('accesstoken');
            dispatch(logout());
        });

    }
}

export const initDispatcher = () => {
    return async (dispatch) => {
        const token = localStorage.getItem('accesstoken');
        if (token) {
            authApi.get('api/auth/user').then((user) => {
                dispatch(login({ user: user.data, auht: { access_token: token } }));
            })
        }
    }
}





