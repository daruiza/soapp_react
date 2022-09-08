import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PrivateNavBar, PublicNavBar } from "../../router";

export const NavBarAccesInit = () => {
    return (
        <>
            <PublicNavBar>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/"> Inicio </NavLink>
            </PublicNavBar>

            <PrivateNavBar>
                
            </PrivateNavBar>
        </>
    )
}
