import { useReducer } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './AuthReducer';

const authReducerInit = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { logged: !!user, user: user}
}

export const AuthProvider = ({ children }) => {
    const [authState, authDispatch] = useReducer(authReducer, authReducerInit());
    return (
        <AuthContext.Provider value={{ ...authState, authDispatch }}>
            {children}
        </AuthContext.Provider>
    )
}
