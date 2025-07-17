from datetime import datetime
from flask import Blueprint, jsonify, request
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.pagoService import PagoService
from peluqueria_backend.services.turnoService import TurnoService
import logging

logger = logging.getLogger(__name__)
turno_bp = Blueprint('turno_bp', __name__)

@turno_bp.route('/', methods=['GET'])
@token_required
def listar_turnos():

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

    try:
        turno = TurnoService.obtener_turno_por_id(turno_id)
        return jsonify({
            'success': True,
            'data': turno.serialize()
        })
    except APIError as e:
        logger.error(f"Error al obtener turno {turno_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/cliente/<int:cliente_id>', methods=['GET'])
@token_required
def listar_turnos_by_cliente(cliente_id):

    try:
        
        turnos = TurnoService.listar_turnos_by_cliente(
            cliente_id=cliente_id
        )
        
        return jsonify({
            'success': True,
            'data': [t.serialize() for t in turnos],
            'count': len(turnos)
        })
    except APIError as e:
        logger.error(f"Error al listar turnos: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/', methods=['POST'])
@token_required
def crear_turno():

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

    try:
        servicio_id = request.args.get('servicio_id', type=int)
        
        if not servicio_id:
            raise APIError("El parámetro 'servicio_id' es requerido", status_code=400)
            
        slots = TurnoService.obtener_disponibilidad(empleado_id, servicio_id)
        
        return jsonify({
            'success': True,
            'data': slots,
            'count': len(slots)
        })
    except APIError as e:
        logger.error(f"Error al obtener disponibilidad: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@turno_bp.route('/reservar', methods=['POST'])
@token_required
def reservar_turno():
    try:
        data = request.get_json()
        
        if data.get('turnoId') is None:
            raise APIError("Se requiere el ID del turno", status_code=400)
        
        turno = TurnoService.reservar_turno_existente(
            turno_id=data['turnoId'],
            cliente_id=data['clienteId']
        )
        
        return jsonify({
            'success': True,
            'message': 'Turno reservado exitosamente',
            'data': {
                'turno': turno
            }
        }), 200
        
    except APIError as e:
        return jsonify(e.to_dict()), e.status_code
    
@turno_bp.route('/procesar-pago', methods=['POST'])
@token_required
def procesar_pago():
    try:
        data = request.get_json()
        pago = PagoService.pagar_turno(
            turno_id=data['turnoId'],
            monto=data['monto'],
            metodo_pago_id=data['metodoPagoId'],
            datos_pago=data.get('notas', '')
        )
        return jsonify({
            'success': True,
            'message': 'Pago procesado exitosamente',
            'data': pago.serialize()
        })
    except APIError as e:
        return jsonify(e.to_dict()), e.status_code
    
@turno_bp.route('/cancelar', methods=['POST'])
@token_required
def cancelar_turno():
    try:
        data = request.get_json()
        turno_id = data.get('turnoId')

        if not turno_id:
            raise APIError("Se requiere el ID del turno", status_code=400)

        turno = TurnoService.cancelar_reserva(turno_id)

        return jsonify({
            'success': True,
            'message': 'Turno cancelado exitosamente',
            'data': turno.serialize()
        }), 200

    except APIError as e:
        return jsonify(e.to_dict()), e.status_code
