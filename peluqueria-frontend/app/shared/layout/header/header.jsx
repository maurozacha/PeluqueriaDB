import React from 'react';
import { Translate } from 'react-jhipster';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ability from '../config/ability';

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

export default Home;