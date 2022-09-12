import { createSlice } from "@reduxjs/toolkit";

export const requestApiSlice = createSlice({
    name: 'backdrop',
    initialState: {
        backdrop: [],
        open: false,
        message: '',
        alert: ''
    },
    reducers: {
        backdropPush: (state, { payload }) => {
            state.backdrop.push(payload);
            state.open = true;
        },
        backdropPop: (state, { payload }) => {
            state.backdrop.pop();
            state.open = state.backdrop.length ? true : false;
            state.message = payload.message
            state.alert = payload.alert
        }
    }
})

export const { backdropPush, backdropPop } = requestApiSlice.actions;