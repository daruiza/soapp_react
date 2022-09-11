import { NavLink } from "react-router-dom";
import { PrivateResponsibleRoute } from '../../middleware'

export const NavBarUsers = () => {
    return (
        <>
            <PrivateResponsibleRoute>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="users/index"> Usuarios </NavLink>
            </PrivateResponsibleRoute>
        </>
    )
}
