import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'not-authenticated', //'checking', 'not-authenticated' , 'authenticated'
        token: null,
        user: null,
    },
    reducers: {
        login: (state, { payload }) => {
            state.status = 'authenticated';
            state.token = payload.auht.access_token;
            state.user = payload.user;
        },
        logout: (state, payload) => {
            state.status = 'not-authenticated';
            state.token = null;
            state.user = null;
        },
        checkingCredentials: (state) => {
            state.status = 'checking';
        },
    }
})

export const { login, logout, checkingCredentials } = authSlice.actions;