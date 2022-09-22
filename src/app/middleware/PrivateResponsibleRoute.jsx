import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
import { RolTypes } from '../types';

export const PrivateResponsibleRoute = ({ children }) => {
  const { status, user } = useSelector(state => state.auth);
  const RESPONSIBLEAUTHENTICATED = useMemo(() =>
    status === authstatusTypes.AUTHENTICATED &&
    (
      user?.rol?.id === RolTypes.responsible ||
      user?.rol?.id === RolTypes.superadmin
    ),
    [status, user])
  return (RESPONSIBLEAUTHENTICATED)
    ? children
    : <></>
}
