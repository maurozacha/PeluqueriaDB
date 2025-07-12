import React from 'react';
import { Nav, Navbar } from 'reactstrap';
import { Brand, Home } from './header-component'; 
import './header.scss';
const Header = ({ }) => {
  return (
    <Navbar color="orange" light expand="md">
      <Brand />
      <Nav navbar>
        <Home /> 
       
      </Nav>
    </Navbar>
  );
};

export default Header;