import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './logo.png';
import logo2 from './logo.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import useLocalStorage from 'use-local-storage';

function Navigation() {
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

    const toggleTheme = () => {
        localStorage.setItem('dark', darkMode)
        setDarkMode(!darkMode);
        // onThemeToggle(!darkMode);s
    };

    return (
        <Navbar 
            expand="lg" 
            className= {darkMode ? "bg-dark navbar-dark" : "bg-light navbar-light"}
        >
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt="logo"
                        src={darkMode ? logo2 : logo }
                        width="45"
                        height="45"
                        className="d-inline-block align-top rounded-full"
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

                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline-secondary"
                    >
                        {darkMode ? (<FontAwesomeIcon icon={faSun} />) : (<FontAwesomeIcon icon={faMoon} />)}
                    </button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
