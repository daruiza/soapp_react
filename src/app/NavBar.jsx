import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap"
import { NavBarAuthEnd, NavBarAuthStart } from "./modules/auth";
import { NavBarUsers } from "./modules/users/NavBarUsers";
import { useTheme } from "@emotion/react";
import { TooltipAvatarComponent } from "./modules/auth/navbar/TooltipAvatarComponent";
import { useMediaQuery } from "react-responsive";
export const NavBar = () => {
    const { palette } = useTheme();
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    return (
        <>
            <Navbar style={{ backgroundColor: `${palette.primary.main}` }} expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        {/* <img src={asistirEnSaludBran} alt="asistirEnSaludBran" /> */}
                        <Navbar.Text style={{ color: `${palette.text.primary}` }} >Asistir En Salud</Navbar.Text>
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
