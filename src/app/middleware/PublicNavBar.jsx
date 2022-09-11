import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
export const PublicNavBar = ({ children }) => {
    const { status } = useSelector(state => state.auth);
    return (status === authstatusTypes.NOTAUTHENTICATED)
        ? children
        : <></>
}
