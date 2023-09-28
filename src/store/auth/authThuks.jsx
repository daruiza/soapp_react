import { useAuth } from "../../api";
import { commerceInitialState, commerceUpdate } from "../commerce";
import { getCommerceByUser } from "../commerce/commerceThuks";
import { checkingCredentials, logout, login } from "./";

const setLoginResponse = (dispatch, user, auht) => {
    dispatch(login({
        user: { ...user.User },
        auht: auht
    }));
    dispatch(getCommerceByUser(user))
        .then(({ data: { data: { commerce } } }) => {
            dispatch(commerceUpdate({ commerce }))
        });
}

export const checkingAuthentication = (email, password) => {
    return (dispatch) => {
        const { authApi } = useAuth(dispatch);
        dispatch(checkingCredentials());
        authApi.post('api/auth/login', {
            email: email,
            password: password
        }).then(({ data: { data } }) => {
            localStorage.setItem(`${window.location.hostname}`, data.access_token);
            authApi.get('api/auth/user').then(({ data: { data: user } }) => {
                setLoginResponse(dispatch, user, data);
            })
        }).catch((error) => {
            // Falta mostrar el error
            localStorage.removeItem(`${window.location.hostname}`);
            dispatch(logout());
            dispatch(commerceInitialState());
        });
    }
}

export const initDispatcher = () => {
    return async (dispatch) => {
        const { authApi } = useAuth(dispatch);
        const token = localStorage.getItem(`${window.location.hostname}`);
        if (token) {
            authApi.get('api/auth/user').then(({ data: { data: user } }) => {
                setLoginResponse(dispatch, user, { access_token: token });
            }).catch((error) => {
                // Falta mostrar el error
                localStorage.removeItem(`${window.location.hostname}`);
                dispatch(logout());
                dispatch(commerceInitialState());
            });
        }
    }
}

export const getAllRols = () => {
    return async (dispatch) => {
        const { authApi } = useAuth(dispatch);
        return authApi.get(`api/rol/index`);
    }
}


export const logoutDispatcher = () => {
    return async (dispatch) => {
        const { authApi } = useAuth(dispatch);
        authApi.get('api/auth/logout').then((logoutRequest) => {
            localStorage.removeItem(`${window.location.hostname}`);
            dispatch(logout());
            dispatch(commerceInitialState());
        });
    }
}





