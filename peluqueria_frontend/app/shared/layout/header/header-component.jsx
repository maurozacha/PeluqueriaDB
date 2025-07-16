import React, { useState } from 'react';
import { 
  NavItem, 
  NavLink, 
  NavbarBrand,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../reducers/auth.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCalendarAlt, 
  faScissors, 
  faUsers, 
  faUserCog, 
  faKey, 
  faSignOutAlt,
  faSignInAlt,
  faUser,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';
import icono from '../../image/icono.png';
import { toast } from 'react-toastify';

export const BrandIcon = (props) => (
  <div {...props} className="brand-icon">
    <img src={icono} alt="Logo del Sistema" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo salon-brand">
    <BrandIcon />
    <span className="brand-title">Peluquería DB</span>
  </NavbarBrand>
);

export const Home = () => (
  <NavItem className="salon-nav-item">
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon={faHome} className="mr-2" />
      <span>Inicio</span>
    </NavLink>
  </NavItem>
);

export const ServicesMenu = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <NavItem className="salon-nav-item">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
        <DropdownToggle nav caret>
          <FontAwesomeIcon icon={faScissors} className="mr-2" />
          Servicios
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => navigate('/servicios')}>
            ABM Servicios
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  );
};

export const UsersMenu = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <NavItem className="salon-nav-item">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
        <DropdownToggle nav caret>
          <FontAwesomeIcon icon={faUsers} className="mr-2" />
          Personas
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => navigate('/personas')}>
            ABM Personas
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/usuarios')}>
            ABM Usuarios
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  );
};

export const TurnoMenu = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <NavItem className="salon-nav-item">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
        <DropdownToggle nav caret>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          Turnos
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => navigate('/pedir-turno')}>
            Pedir Turno
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/consultar-turno')}>
            Consultar Turno
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  );
};

export const LoginButton = () => (
  <NavItem className="salon-nav-item">
    <NavLink tag={Link} to="/login" className="d-flex align-items-center">
      <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
      <span>Iniciar Sesión</span>
    </NavLink>
  </NavItem>
);

export const UserMenu = ({ userData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success('Sesión cerrada correctamente');
        navigate('/');
      })
      .catch((error) => {
        toast.error('Error al cerrar sesión');
      });
  };

  return (
    <NavItem className="salon-nav-item">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
        <DropdownToggle nav caret>
          <FontAwesomeIcon icon={faUserCog} className="mr-2" />
          {userData?.usuario ? `${userData.usuario.split(' ')[0]}` : 'Iniciar Sesión'}
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem onClick={() => navigate('/perfil')}>
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Mi Perfil
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/mis-turnos')}>
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
            Mis Turnos
          </DropdownItem>
          <DropdownItem onClick={() => navigate('/cambiar-contraseña')}>
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            Cambiar Contraseña
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  );
};