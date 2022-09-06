import { Container, Navbar, Nav } from "react-bootstrap"
import { Link, NavLink } from "react-router-dom";
import asistirEnSaludBran from '../../../../assets/asistirEnSaludBran.png';


export const NavBarHome = () => {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        {/* <img src={asistirEnSaludBran} alt="asistirEnSaludBran" /> */}
                        <Navbar.Text>ASISTIR EN SALUD</Navbar.Text>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/"> Inicio </NavLink>
                        </Nav>
                    </Navbar.Collapse>
                    
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text></Navbar.Text>
                        <Nav>
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/singin"> Registro </NavLink>
                            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/login"> Acceso </NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
