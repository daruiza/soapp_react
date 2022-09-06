import { useReducer } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';

const authReducerInit = () => {
    return { logged: false }
}

export const AuthProvider = ({ children }) => {
    const [authState, authDispatch] = useReducer(authReducer, authReducerInit());
    return (
        <AuthContext.Provider value={{ authState, authDispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
