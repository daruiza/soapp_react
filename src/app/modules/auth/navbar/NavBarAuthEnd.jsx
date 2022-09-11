import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PublicNavBar, PrivateNavBar } from "../../../middleware";


export const NavBarAuthEnd = () => {
    return (
        <>
            <PublicNavBar>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="auth/singin"> Registro </NavLink>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="auth/login"> Ingreso </NavLink>
            </PublicNavBar>

            <PrivateNavBar>
                <Navbar.Text>Nombre usuario</Navbar.Text>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="auth/logout"> Salir </NavLink>
            </PrivateNavBar>
        </>
    )
}
