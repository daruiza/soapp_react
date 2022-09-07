import { useContext } from 'react';
import { AuthContext } from '../modules/access';
export const PublicNavBar = ({ children}) => {
    const { logged } = useContext(AuthContext)
    return (!logged)
        ? children
        : <></>
}
