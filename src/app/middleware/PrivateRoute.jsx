import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { authstatusTypes } from '../../store';

export const PrivateRoute = ({ children }) => {
    const { status } = useSelector(state => state.auth);
    const AUTHENTICATED = useMemo(() => status === authstatusTypes.AUTHENTICATED, [status])
    return (AUTHENTICATED)
        ? children
        : <Navigate to="/login" />
}
