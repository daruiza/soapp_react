import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { AuthTypes } from '../../../types';
import { AuthContext } from '../context/AuthContext'

export const LoginComponent = () => {

    const { user, authDispatch } = useContext(AuthContext);

    console.log('LoginComponent', user);
    const onLogin = () => {
        const user = {
            id: '123',
            name: 'John',
            rol: 3
        }
        const action = {
            type: AuthTypes.login,
            payload: user
        }
        localStorage.setItem('user', JSON.stringify(user));
        authDispatch(action);
    }


    return (
        <>
            <Button onClick={onLogin}>Login</Button>
        </>
    )
}