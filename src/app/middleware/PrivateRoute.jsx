import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { authstatusTypes } from '../../store';

export const PrivateRoute = ({ children }) => {
    const { status } = useSelector(state => state.auth);
    return (status === authstatusTypes.AUTHENTICATED)
        ? children
        : <Navigate to="/login" />
}
