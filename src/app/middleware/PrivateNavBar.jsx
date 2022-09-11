import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
export const PrivateNavBar = ({ children }) => {
    const { status } = useSelector(state => state.auth);
    return (status === authstatusTypes.AUTHENTICATED)
        ? children
        : <></>
}
