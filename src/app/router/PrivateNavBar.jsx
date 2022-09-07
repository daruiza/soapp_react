import { useContext } from 'react';
import { AuthContext } from '../modules/access';
export const PrivateNavBar = ({ children }) => {
    const { logged } = useContext(AuthContext)
    return (logged)
        ? children
        : <></>
}
