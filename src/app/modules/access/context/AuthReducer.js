import { AuthTypes } from "../../../types";

export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case AuthTypes.login:
            return {
                ...state,
                logged: true,
                user: action.payload
            }
        case AuthTypes.logout:
            return {
                ...state,
                logged: false,
                user: {}
            }
        default: return { ...state };
    }
}