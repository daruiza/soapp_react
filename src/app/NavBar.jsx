import { useTheme } from "@mui/material";
import { Container, Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom";
import { NavBarAuthEnd, NavBarAuthStart } from "./modules/auth";
import { NavBarUsers } from "./modules/users/NavBarUsers";

export const NavBar = () => {

    const theme = useTheme();
    // console.log('theme',theme);    
    return (
        <>
            <Navbar className="bglight" bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        {/* <img src={asistirEnSaludBran} alt="asistirEnSaludBran" /> */}
                        <Navbar.Text>ASISTIR EN SALUD</Navbar.Text>
                    </Navbar.Brand>
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
