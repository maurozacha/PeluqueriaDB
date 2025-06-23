
import React from 'react';
import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { Link } from 'react-router-dom';
import icono from '../../image/icono.png';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src={icono} alt="Logo del Sistema" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    <BrandIcon />
   
  </NavbarBrand>
);


export const Home = () => {
  return (
    <NavItem>
      <NavLink tag={Link} to="/" className="d-flex align-items-center">
     
        <span className="ml-2">Menú</span>
      </NavLink>
    </NavItem>
  );
};

export default Home;