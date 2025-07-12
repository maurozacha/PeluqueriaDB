from datetime import datetime
from flask import Blueprint, jsonify, request
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.turnoService import TurnoService
import logging

logger = logging.getLogger(__name__)
turno_bp = Blueprint('turno_bp', __name__)

@turno_bp.route('/', methods=['GET'])
@token_required
def listar_turnos():
    """Obtiene todos los turnos con filtros opcionales"""
    try:
        cliente_id = request.args.get('cliente_id', type=int)
        empleado_id = request.args.get('empleado_id', type=int)
        estado = request.args.get('estado', type=str)
        fecha = request.args.get('fecha', type=str)
        
        turnos = TurnoService.listar_turnos(
            cliente_id=cliente_id,
            empleado_id=empleado_id,
            estado=estado,
            fecha=fecha
        )
        
        return jsonify({
            'success': True,
            'data': [t.serialize() for t in turnos],
            'count': len(turnos)
        })
    except APIError as e:
        logger.error(f"Error al listar turnos: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/<int:turno_id>', methods=['GET'])
@token_required
def obtener_turno(turno_id):
    """Obtiene un turno específico por su ID"""
    try:
        turno = TurnoService.obtener_turno_por_id(turno_id)
        return jsonify({
            'success': True,
            'data': turno.serialize()
        })
    except APIError as e:
        logger.error(f"Error al obtener turno {turno_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/', methods=['POST'])
@token_required
def crear_turno():
    """Crea un nuevo turno/reserva"""
    try:
        data = request.get_json()
        turno = TurnoService.crear_turno_reserva(
            cliente_id=data['cliente_id'],
            empleado_id=data['empleado_id'],
            servicio_id=data['servicio_id'],
            fecha_hora=datetime.strptime(data['fecha_hora'], '%Y-%m-%d %H:%M'),
            notas=data.get('notas')
        )
        return jsonify({
            'success': True,
            'message': 'Turno creado exitosamente',
            'data': turno
        }), 201
    except APIError as e:
        logger.error(f"Error al crear turno: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/disponibilidad/<int:empleado_id>', methods=['GET'])
@token_required
def obtener_disponibilidad(empleado_id):
    """Obtiene horarios disponibles para un empleado en una fecha específica"""
    try:
        fecha_str = request.args.get('fecha', type=str)
        if not fecha_str:
            raise APIError("El parámetro 'fecha' es requerido", status_code=400)
            
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        slots = TurnoService.obtener_disponibilidad(empleado_id, fecha)
        
        return jsonify({
            'success': True,
            'data': slots,
            'count': len(slots)
        })
    except APIError as e:
        logger.error(f"Error al obtener disponibilidad: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/<int:turno_id>/estado', methods=['PUT'])
@token_required
def cambiar_estado_turno(turno_id):
    """Cambia el estado de un turno (confirmar, cancelar, completar)"""
    try:
        data = request.get_json()
        accion = data.get('accion')
        
        if accion == 'confirmar':
            turno = TurnoService.confirmar_turno(turno_id)
        elif accion == 'cancelar':
            turno = TurnoService.cancelar_turno(turno_id)
        elif accion == 'completar':
            turno = TurnoService.completar_turno(turno_id)
        else:
            raise APIError("Acción no válida", status_code=400)
            
        return jsonify({
            'success': True,
            'message': f'Turno {accion} exitosamente',
            'data': turno.serialize()
        })
    except APIError as e:
        logger.error(f"Error al cambiar estado de turno {turno_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code