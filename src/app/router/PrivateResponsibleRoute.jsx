import { useContext } from 'react'
import { AuthContext } from '../modules/access';
import { RolTypes } from '../types';

export const PrivateResponsibleRoute = ({ children }) => {
  const { logged, user } = useContext(AuthContext)
  console.log('user', user);
  return (logged && user.rol === RolTypes.responsible)
    ? children
    : <></>
}
