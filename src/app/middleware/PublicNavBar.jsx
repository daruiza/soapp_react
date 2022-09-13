import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
export const PublicNavBar = ({ children }) => {
    const { status } = useSelector(state => state.auth);
    const NOTAUTHENTICATED = useMemo(() => status === authstatusTypes.NOTAUTHENTICATED, [status])
    return (NOTAUTHENTICATED)
        ? children
        : <></>
}
