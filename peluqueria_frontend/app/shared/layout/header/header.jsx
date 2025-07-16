import React from 'react';
import { 
  Nav, 
  Navbar, 
  NavbarToggler, 
  Collapse 
} from 'reactstrap';
import { 
  Brand, 
  Home,
  ServicesMenu,
  UsersMenu,
  TurnoMenu,
  LoginButton,
  UserMenu
} from './header-component';
import { useSelector } from 'react-redux';
import './header.scss';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated || false);
  const userData = useSelector(state => state.auth?.userData || null);

  return (
    <Navbar color="#033B71" light expand="md" className="menu-color">
      <Brand />
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar className="justify-content-end">
        <Nav navbar>
          <Home />
          
          {isAuthenticated ? (
            <>
              <TurnoMenu />
              <ServicesMenu />
              <UsersMenu />
              <UserMenu userData={userData} />
            </>
          ) : (
            <LoginButton />
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;