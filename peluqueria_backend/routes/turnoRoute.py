from flask import Blueprint, request, jsonify
from ..auth.decorators import token_required
from services import TurnoService
import datetime

turnos_blueprint = Blueprint('turnos', __name__, url_prefix='/api/turnos')

@turnos_blueprint.route('/', methods=['GET'])
@token_required
def get_turnos():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    estado = request.args.get('estado')
    
    try:
        turnos = TurnoService.get_turnos(fecha_inicio, fecha_fin, estado)
        return jsonify([turno.serialize() for turno in turnos])
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@turnos_blueprint.route('/disponibles', methods=['GET'])
@token_required
def get_disponibilidad():
    servicio_id = request.args.get('servicio_id')
    fecha = request.args.get('fecha')
    empleado_id = request.args.get('empleado_id')
    
    try:
        disponibilidad = TurnoService.get_disponibilidad(
            servicio_id=servicio_id,
            fecha=fecha,
            empleado_id=empleado_id
        )
        return jsonify(disponibilidad)
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@turnos_blueprint.route('/', methods=['POST'])
@token_required
def crear_turno():
    data = request.get_json()
    try:
        turno = TurnoService.crear_turno(
            fecha_hora=data['fecha_hora'],
            cliente_id=data['cliente_id'],
            empleado_id=data['empleado_id'],
            servicio_id=data['servicio_id'],
            notas=data.get('notas')
        )
        return jsonify(turno.serialize()), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@turnos_blueprint.route('/<int:turno_id>', methods=['PUT'])
@token_required
def actualizar_turno(turno_id):
    data = request.get_json()
    try:
        turno = TurnoService.actualizar_turno(
            turno_id=turno_id,
            estado=data.get('estado'),
            notas=data.get('notas')
        )
        return jsonify(turno.serialize())
    except Exception as e:
        return jsonify({'message': str(e)}), 400