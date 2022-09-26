import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { commerceSlice } from "./commerce/commerceSlice";
import { requestApiSlice } from "./requestapi/requestApiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    requestApi: requestApiSlice.reducer,
    commerce: commerceSlice.reducer
  },
})