import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom'
import { authstatusTypes } from '../../store';

export const PublicRoute = ({ children }) => {
  const { status } = useSelector(state => state.auth);
  return (status === authstatusTypes.NOTAUTHENTICATED)
    ? children
    : <Navigate to="/" />
}
