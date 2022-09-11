import { useSelector } from 'react-redux';
import { authstatusTypes } from '../../store';
import { RolTypes } from '../types';

export const PrivateResponsibleRoute = ({ children }) => {
  const { status, user } = useSelector(state => state.auth);
  return (status === authstatusTypes.AUTHENTICATED && user?.rol?.name === RolTypes.responsible)
    ? children
    : <></>
}
