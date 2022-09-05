import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'
export const LoginComponent = () => {

    const { authState, authDispatch } = useContext(AuthContext);

    return (
        <>Login</>
    )
}