import React, { useState } from "react";
import {
  NavItem,
  NavLink,
  NavbarBrand,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../reducers/auth.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import icono from "../../image/icono.png";
import { toast } from "react-toastify";
import { ROLES } from "../../../constants/system-constants";

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

export const ServicesMenu = ({ userData }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown
      className="salon-nav-item"
      isOpen={dropdownOpen}
      toggle={toggle}
      nav
      inNavbar
    >
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={faScissors} className="mr-2" />
        Servicios
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => navigate("/servicios")}>
          Servicios
        </DropdownItem>
        {/* {userData?.rol === ROLES.ADMIN && (
          <DropdownItem onClick={() => navigate('/servicios/abm')}>ABM Servicios</DropdownItem>
        )} */}
      </DropdownMenu>
    </Dropdown>
  );
};

export const UsersMenu = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown
      className="salon-nav-item"
      isOpen={dropdownOpen}
      toggle={toggle}
      nav
      inNavbar
    >
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={faUsers} className="mr-2" />
        Personas
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => navigate("/usuarios")}>
          Modificar rol
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const TurnoMenu = ({ userData }) => {
  if (userData?.rol !== ROLES.ADMIN) return null;

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <Dropdown
      className="salon-nav-item"
      isOpen={dropdownOpen}
      toggle={toggle}
      nav
      inNavbar
    >
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
        Turnos
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => navigate("/mis-turnos")}>
          Mis Turnos
        </DropdownItem>
        {(userData?.rol === ROLES.ADMIN ||
          userData?.rol === ROLES.EMPLEADO) && (
          <DropdownItem onClick={() => navigate("/mis-turnos")}>
            Lista turnos
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
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
        toast.success("Sesión cerrada correctamente");
        navigate("/");
      })
      .catch(() => {
        toast.error("Error al cerrar sesión");
      });
  };

  return (
    <Dropdown
      className="salon-nav-item"
      isOpen={dropdownOpen}
      toggle={toggle}
      nav
      inNavbar
    >
      <DropdownToggle nav caret>
        <FontAwesomeIcon icon={faUserCog} className="mr-2" />
        {userData?.usuario
          ? `${userData.usuario.split(" ")[0]}`
          : "Iniciar Sesión"}
      </DropdownToggle>
      <DropdownMenu end>
        {userData?.rol !== ROLES.ADMIN && (
          <>
            <DropdownItem onClick={() => navigate("/perfil")}>
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Mi Perfil
            </DropdownItem>
            <DropdownItem divider />
          </>
        )}
        {/* <DropdownItem onClick={() => navigate('/cambiar-contraseña')}>
          <FontAwesomeIcon icon={faKey} className="mr-2" />
          Cambiar Contraseña
        </DropdownItem> */}

        <DropdownItem onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
