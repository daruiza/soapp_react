import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PrivateNavBar, PublicNavBar } from "../../../middleware";

export const NavBarAuthStart = () => {
    return (
        <>
            <PublicNavBar>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="auth/logout"> Inicio </NavLink>
            </PublicNavBar>

            <PrivateNavBar>
                
            </PrivateNavBar>
        </>
    )
}
