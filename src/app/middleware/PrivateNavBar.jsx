import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
export const PrivateNavBar = ({ children }) => {
    const { status } = useSelector(state => state.auth);
    const AUTHENTICATED = useMemo(() => status === authstatusTypes.AUTHENTICATED, [status])
    return (AUTHENTICATED)
        ? children
        : <></>
}
