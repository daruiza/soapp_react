

import { useAuth } from "../../api/auth/useAuth";
import { checkingCredentials, logout, login } from "./";

export const checkingAuthentication = (email, password) => {
    return (dispatch) => {
        const { authApi } = useAuth(dispatch);
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
        const { authApi } = useAuth(dispatch);
        const token = localStorage.getItem('accesstoken');
        if (token) {
            authApi.get('api/auth/user').then((userRequest) => {
                dispatch(login({ user: userRequest.data, auht: { access_token: token } }));
            }).catch((error) => {
                // Falta mostrar el error
                localStorage.removeItem('accesstoken');
                dispatch(logout());
            });
        }
    }
}

export const logoutDispatcher = () => {
    return async (dispatch) => {
        const { authApi } = useAuth(dispatch);
        authApi.get('api/auth/logout').then((logoutRequest) => {
            localStorage.removeItem('accesstoken');
            dispatch(logout());
        });
    }
}





