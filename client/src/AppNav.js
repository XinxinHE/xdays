import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import "./AppNav.css";

function AppNav() {
    return(
        <Navbar className="x-appnav-container">
            <Navbar.Brand href="#home">X Days</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">Xinxin He</a>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}
export default AppNav;