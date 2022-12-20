import { useTheme } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { PrivateAgentRoute } from '../../middleware'

export const NavBarUsers = () => {
    const { palette } = useTheme();
    return (
        <>
            <PrivateAgentRoute>
                <NavLink style={{ color: `${palette.text.primary}` }} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="users/index"> Usuarios </NavLink>
            </PrivateAgentRoute>
        </>
    )
}
