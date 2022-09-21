import { createSlice } from "@reduxjs/toolkit";
import { authstatusTypes } from "./authstatusTypes";
import { capitalize } from "@mui/material";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: authstatusTypes.NOTAUTHENTICATED,
        token: null,
        user: null,
    },
    reducers: {
        login: (state, { payload }) => {
            state.status = authstatusTypes.AUTHENTICATED;
            state.token = payload?.auht?.access_token ?? state.token;
            state.user = {
                ...payload.user,
                fullname: `${capitalize(payload.user.name)} ${capitalize(payload.user.lastname)}`,
                capital: `${payload.user?.name?.charAt(0).toUpperCase()}`
            };
        },
        logout: (state) => {
            state.status = authstatusTypes.NOTAUTHENTICATED;
            state.token = null;
            state.user = null;
        },
        checkingCredentials: (state) => {
            state.status = authstatusTypes.CHECKING;
        }        
    }
})

export const { login, logout, checkingCredentials, updateUser } = authSlice.actions;