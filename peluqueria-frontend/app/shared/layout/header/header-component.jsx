import React from 'react';
import { Translate } from 'react-jhipster';
import { NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src=" /* agregar logo sistema*/" alt="Logo del Sistema" />
  </div>
);

export const Brand = () => (
  <NavbarBrand 
    tag={ability.can('access', 'menu-inicio') ? Link : 'div'} 
    to={ability.can('access', 'menu-inicio') ? "/" : undefined} 
    className="brand-logo"
  >
    <BrandIcon />
    <span className="brand-title">
      <Translate contentKey="global.title">PeluqueriaDB</Translate>
    </span>
    <span className="navbar-version">{process.env.REACT_APP_VERSION || '1.0.0'}</span>
  </NavbarBrand>
);

export const Home = () => {
  if (!ability.can('access', 'menu-inicio')) {
    return null;
  }

  return (
    <NavItem>
      <NavLink tag={Link} to="/" className="d-flex align-items-center">
        <FontAwesomeIcon icon="home" />
        <span className="ml-2">
          <Translate contentKey="global.menu.home">Inicio</Translate>
        </span>
      </NavLink>
    </NavItem>
  );
};