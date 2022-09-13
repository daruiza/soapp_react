import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap"
import { NavBarAuthEnd, NavBarAuthStart } from "./modules/auth";
import { NavBarUsers } from "./modules/users/NavBarUsers";
import { useTheme } from "@emotion/react";
import { TooltipAvatarComponent } from "./modules/auth/navbar/TooltipAvatarComponent";

export const NavBar = (props) => {
    const { palette } = useTheme();
    return (
        <>
            <Navbar style={{ backgroundColor: `${palette.primary.main}` }} expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        {/* <img src={asistirEnSaludBran} alt="asistirEnSaludBran" /> */}
                        <Navbar.Text style={{ color: `${palette.text.primary}` }} >Asistir En Salud</Navbar.Text>
                    </Navbar.Brand>
                    <TooltipAvatarComponent xs='block' sm='none' />
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavBarAuthStart />
                            <NavBarUsers />
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <NavBarAuthEnd />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
