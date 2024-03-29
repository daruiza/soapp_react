import { createSlice } from "@reduxjs/toolkit";
import { capitalize } from "@mui/material";

export const commerceSlice = createSlice({
    name: 'commerce',
    initialState: {
        commerce: null,
    },
    reducers: {
        commerceUpdate: (state, { payload }) => {
            state.commerce = payload && payload.commerce ? {
                ...payload.commerce,
                fullname: `${capitalize(payload?.commerce?.name ?? '')}`,
                capital: `${payload?.commerce?.name?.charAt(0).toUpperCase()}`
            } : null;
        },

        commerceInitialState: (state) => {
            state.commerce = null;
        }
    }
})

export const { commerceUpdate, commerceInitialState } = commerceSlice.actions;