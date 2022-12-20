import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
import { RolTypes } from '../types';

export const PrivateAgentRoute = ({ children }) => {
  const { status, user } = useSelector(state => state.auth);
  const AGENTAUTHENTICATED = useMemo(() =>
    status === authstatusTypes.AUTHENTICATED &&
    (
      user?.rol?.id === RolTypes.agente ||
      user?.rol?.id === RolTypes.superadmin
    ),
    [status, user])
  return (AGENTAUTHENTICATED)
    ? children
    : <></>
}
