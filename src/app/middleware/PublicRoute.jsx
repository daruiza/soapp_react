import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { authstatusTypes } from '../../store';

export const PublicRoute = ({ children }) => {
  const { status } = useSelector(state => state.auth);
  const NOTAUTHENTICATED = useMemo(() => status === authstatusTypes.NOTAUTHENTICATED, [status])
  return (NOTAUTHENTICATED)
    ? children
    : <Navigate to="/" />
}
