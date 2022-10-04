import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { NavBarAuthEnd, NavBarAuthStart } from "./modules/auth";
import { NavBarUsers } from "./modules/users/NavBarUsers";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap"
import { TooltipAvatarComponent } from "./modules/auth/navbar/TooltipAvatarComponent";
import { Avatar } from "@mui/material";

export const NavBar = ({ navBarWidth = 58 }) => {
    const { palette } = useTheme();
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const { commerce: commerceState } = useSelector(state => state.commerce);
    const commerce = useMemo(() => commerceState, [commerceState]);
    return (
        <>
            <Navbar style={{ backgroundColor: `${palette.primary.main}` }} expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" style={{
                        padding: '0px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* <img src={asistirEnSaludBran} alt="asistirEnSaludBran" /> */}
                        {
                            commerce && commerce.logo && commerce.logo !== '' &&
                            <Avatar
                                style={{ cursor: 'pointer' }}
                                alt="Logo"
                                src={commerce.logo}
                                sx={{ width: 32, height: 32, mr: 1 }}
                            />
                        }
                        <Navbar.Text style={{ color: `${palette.text.primary}`, padding: '0px' }} >
                            {!commerce && 'Asistir En Salud'}
                            {commerce && `${commerce.name}`}
                        </Navbar.Text>

                    </Navbar.Brand>
                    {isMobile && <TooltipAvatarComponent xs='block' sm='none' />}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavBarAuthStart />
                            <NavBarUsers />
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <NavBarAuthEnd isMobile={isMobile} />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
