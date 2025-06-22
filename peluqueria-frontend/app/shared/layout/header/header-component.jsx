
import React from 'react';
import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="/* agregar logo sistema */" alt="Logo del Sistema" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
    <span className="brand-title">PeluqueriaDB</span>
    <span className="navbar-version">{process.env.REACT_APP_VERSION || '1.0.0'}</span>
  </NavbarBrand>
);


export const Home = () => {
  return (
    <NavItem>
      <NavLink tag={Link} to="/" className="d-flex align-items-center">
        <FontAwesomeIcon icon={faHome} />
        <span className="ml-2">Inicio</span>
      </NavLink>
    </NavItem>
  );
};

export default Home;