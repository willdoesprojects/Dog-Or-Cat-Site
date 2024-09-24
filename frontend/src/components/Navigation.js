import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './logo.png';

function Navigation() {
    // State to track the theme mode
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <Navbar 
            expand="lg" 
            className={darkMode ? "bg-dark navbar-dark" : "bg-light navbar-light"}
        >
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt="logo"
                        src={logo}
                        width="45"
                        height="45"
                        className="d-inline-block align-top"
                    />{' '}
                    PetID
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/aboutme">About Me</Nav.Link>
                        <Nav.Link href="/implementation">Implementation</Nav.Link>
                    </Nav>
                    {/* Add a button to toggle between night and daylight */}
                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline-secondary"
                    >
                        {darkMode ? "Switch to Daylight" : "Switch to Night"}
                    </button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
