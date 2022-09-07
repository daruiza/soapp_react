import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PrivateNavBar, PublicNavBar } from "../../router";

export const NavBarAccesEnd = () => {
    return (
        <>
            <PublicNavBar>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="acces/singin"> Registro </NavLink>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="acces/login"> Acceso </NavLink>
            </PublicNavBar>

            <PrivateNavBar>
                <Navbar.Text>Nombre usuario</Navbar.Text>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="acces/logout"> Salir </NavLink>
            </PrivateNavBar>
        </>
    )
}
