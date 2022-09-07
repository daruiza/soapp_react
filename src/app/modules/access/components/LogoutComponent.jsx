import { useContext } from "react";
import { Button } from 'react-bootstrap';
import { AuthTypes } from "../../../types";
import { AuthContext } from "../context";

export const LogoutComponent = () => {

  const { user, authDispatch } = useContext(AuthContext);

  console.log('LogoutComponent', user);
  const onLoout = () => {
    const user = {}
    const action = {
      type: AuthTypes.logout,
      payload: user
    }
    localStorage.removeItem('user');
    authDispatch(action);
  }


  return (
    <>
      <Button onClick={onLoout}>LogOut</Button>
    </>
  )
}
