import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../app/shared/layout/layout";
import PageNotFound from "../app/shared/error/page-not-found";
import HomeComponent from "./modules/home/home.component";
import Login from "../app/pages/gestion-usuario/login.component";
import Register from "../app/pages/gestion-usuario/registro.component";
import ServicioListComponent from "../app/pages/servicios/servicio-list.component";
import ReservarTurnoComponent from "../app/pages/turnos/reserva-turno.component";
import TurnosListComponent from "../app/pages/turnos/turnos-list.component";
import PerfilUsuarioComponent from "../app/pages/gestion-usuario/perfil-usuario.component";
import DetallePagoComponent from "../app/pages/pagos/detalle-pago.component";

const RequireAuth = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeComponent />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="servicios" element={<ServicioListComponent />} />
        <Route path="reservar-turno" element={<ReservarTurnoComponent />} />
        <Route path="/mis-turnos" element={<TurnosListComponent />} />
        <Route path="/perfil" element={<PerfilUsuarioComponent />} />
        <Route path="/pagos/:pagoId" element={<DetallePagoComponent />} />

        <Route element={<RequireAuth />}></Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
