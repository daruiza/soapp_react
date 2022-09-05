import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
export const LoginComponent = () => {

    const { authState, authDispatch } = useContext(AuthContext);
    console.log('authState', authState);    
    return (
        <>Login</>
    )
}