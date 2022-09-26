
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navbar } from "react-bootstrap";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { PublicNavBar, PrivateNavBar } from "../../../middleware";
import { TooltipAvatarComponent } from "./TooltipAvatarComponent";
import { useTheme } from "@emotion/react";
import { Button } from "@mui/material";

export const NavBarAuthEnd = ({ isMobile }) => {
    const { palette } = useTheme();
    const { user: userauth } = useSelector(state => state.auth);
    const user = useMemo(() => userauth, [userauth])
    return (
        <>
            <PublicNavBar>
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="auth/singin" style={{ color: `${palette.text.primary}` }}> Registro </NavLink>
                <Button
                    size="small"
                    component={RouterLink}
                    to="auth/login"
                    variant="outlined"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'inherit',
                        borderColor: palette.text.primary,
                        color: palette.text.primary,
                        '&:hover': {
                            color: palette.text.primary,
                            borderColor: palette.secondary.main,
                        }

                    }}
                >Iniciar Sesión</Button>
            </PublicNavBar>

            <PrivateNavBar>
                <Navbar.Text style={{ color: `${palette.text.primary}` }}>{user?.fullname}</Navbar.Text>
                {!isMobile && <TooltipAvatarComponent xs='none' sm='block' />}
            </PrivateNavBar>
        </>
    )
}
