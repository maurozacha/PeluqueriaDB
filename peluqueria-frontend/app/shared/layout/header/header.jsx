import React from 'react';
import { Nav, Navbar } from 'reactstrap';
import { Brand, Home } from './header-component'; 

const Header = ({ isAuthenticated, isLoading, /* otros props */ }) => {
  return (
    <Navbar color="light" light expand="md">
      <Brand />
      <Nav navbar>
        <Home /> 
       
      </Nav>
    </Navbar>
  );
};

export default Header;