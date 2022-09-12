import { useDispatch } from "react-redux";
import { Button } from 'react-bootstrap';
import { AuthTypes } from "../../../types";
import { useContext } from "react";
import { AuthContext } from "../context";
import { logoutDispatcher } from "../../../../store";

export const LogoutComponent = () => {

  const dispatch = useDispatch();
  // const { user, authDispatch } = useContext(AuthContext);

  // console.log('LogoutComponent', user);
  const onLoout = () => {
    // const user = {}
    // const action = {
    //   type: AuthTypes.logout,
    //   payload: user
    // }
    // authDispatch(action);
    dispatch(logoutDispatcher())
  }



  return (
    <>
      <Button onClick={onLoout}>LogOut</Button>
    </>
  )
}
