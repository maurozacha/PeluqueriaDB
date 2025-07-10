from flask import Blueprint, jsonify, request
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.services.turnoService import TurnoService
from peluqueria_backend.models.enumerations.estadoTurnoEnum import EstadoTurno

turnos_blueprint = Blueprint('turnos', __name__)

@turnos_blueprint.route('/turnos', methods=['GET'])
def listar_turnos():
    """Obtiene todos los turnos disponibles"""
    turnos = TurnoService.listar_turnos()
    return jsonify([t.serialize() for t in turnos])

@turnos_blueprint.route('/turnos/<int:turno_id>', methods=['GET'])
def obtener_turno(turno_id):
    """Obtiene un turno específico por su ID"""
    turno = TurnoService.obtener_turno_por_id(turno_id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    return jsonify(turno.serialize())

@turnos_blueprint.route('/turnos', methods=['POST'])
@token_required
def crear_turno():
    """Crea un nuevo turno (reemplaza la creación de reserva)"""
    data = request.get_json()
    
    required_fields = ['cliente_id', 'empleado_id', 'servicio_id', 'fecha_hora']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    turno = TurnoService.crear_turno(data)
    return jsonify(turno.serialize()), 201

@turnos_blueprint.route('/turnos/<int:turno_id>/cancelar', methods=['PUT'])
@token_required
def cancelar_turno(turno_id):
    """Cancela un turno existente"""
    turno = TurnoService.cancelar_turno(turno_id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    return jsonify(turno.serialize())

@turnos_blueprint.route('/turnos/<int:turno_id>/confirmar', methods=['PUT'])
@token_required
def confirmar_turno(turno_id):
    """Confirma un turno existente"""
    turno = TurnoService.confirmar_turno(turno_id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    return jsonify(turno.serialize())

@turnos_blueprint.route('/turnos/<int:turno_id>/completar', methods=['PUT'])
@token_required
def completar_turno(turno_id):
    """Marca un turno como completado"""
    turno = TurnoService.completar_turno(turno_id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    return jsonify(turno.serialize())

@turnos_blueprint.route('/empleados/<int:empleado_id>/turnos', methods=['GET'])
def obtener_turnos_por_empleado(empleado_id):
    """Obtiene todos los turnos de un empleado específico"""
    fecha = request.args.get('fecha')
    if fecha:
        turnos = TurnoService.turnos_por_empleado_y_fecha(empleado_id, fecha)
    else:
        turnos = TurnoService.listar_turnos_por_empleado(empleado_id)
    return jsonify([t.serialize() for t in turnos])