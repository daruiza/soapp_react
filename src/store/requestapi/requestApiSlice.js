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
            state.message = ''
        },
        backdropPop: (state, { payload }) => {
            state.backdrop.pop();
            state.open = state.backdrop.length;
            state.message = payload.message??null
            state.alert = payload.alert??null
        },        
        messagePush: (state, { payload }) => { 
            state.message = payload.message
            state.alert = payload.alert
        }
    }
})

export const { backdropPush, backdropPop, messagePush } = requestApiSlice.actions;