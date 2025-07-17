export const SYSTEM_TITLE = 'Peluqueria';

export const FOOTER_TITLE = 'Sistema de peluqueria DB, reservas de turnos';

export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENTE: 'CLIENTE',
  EMPLEADO: 'EMPLEADO'
};

export const ESTADO_PAGOS = {
  1: 'PENDIENTE',
  2: 'APROBADO',
  3: 'RECHAZADO',
  4: 'REEMBOLSADO',
  5: 'CANCELADO',
}

export const MEDIOS_PAGO = {
  1: 'MERCADO PAGO',
  2: 'EFECTIVO'
}

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