import { useTheme } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { PrivateResponsibleRoute } from '../../middleware'

export const NavBarUsers = () => {
    const { palette } = useTheme();
    return (
        <>
            <PrivateResponsibleRoute>
                <NavLink style={{ color: `${palette.text.primary}` }} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="users/index"> Usuarios </NavLink>
            </PrivateResponsibleRoute>
        </>
    )
}
