import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
import { RolTypes } from '../types';

export const PrivateCustomerRoute = ({ children }) => {
    const { status, user } = useSelector(state => state.auth);
    const CUSTOMERAUTHENTICATED = useMemo(() =>
        status === authstatusTypes.AUTHENTICATED && user?.rol?.id === RolTypes.customer,
        [status, user])
    return (CUSTOMERAUTHENTICATED)
        ? children
        : <></>
}
