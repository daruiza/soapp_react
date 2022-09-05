import { authTypes } from './authTypes';
export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case authTypes.login:
            return {
                ...state,
                logged: true,
                user: action.payload
            }
        case authTypes.logout:
            return {
                ...state,
                logged: false,
                user: {}
            }
        default: state;
    }
}