export const SYSTEM_TITLE = 'Peluqueria';

export const FOOTER_TITLE = 'Sistema de peluqueria DB, reservas de turnos';

export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENTE: 'CLIENTE',
  EMPLEADO: 'EMPLEADO'
};

export const formatFecha = (fechaStr) => {
  const [year, month, day] = fechaStr.split("-");
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return `Fecha: ${day} de ${meses[parseInt(month) - 1]} del ${year}`;
};