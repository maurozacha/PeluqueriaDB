from flask import Blueprint, jsonify, request
from services.turnoService import TurnoService

turno_bp = Blueprint('turno', __name__)

@turno_bp.route('/turnos', methods=['GET'])
def listar_turnos():
    turnos = TurnoService.listar_turnos()
    return jsonify([t.serialize() for t in turnos])

@turno_bp.route('/turnos/<int:turno_id>', methods=['GET'])
def obtener_turno(turno_id):
    turno = TurnoService.obtener_turno_por_id(turno_id)
    if not turno:
        return jsonify({'error': 'Turno no encontrado'}), 404
    return jsonify(turno.serialize())

@turno_bp.route('/turnos/<int:turno_id>/reservar', methods=['POST'])
def reservar_turno(turno_id):
    data = request.get_json()
    reserva = TurnoService.crear_reserva_para_turno(turno_id, data)
    if not reserva:
        return jsonify({'error': 'Turno no encontrado'}), 404
    return jsonify(reserva.serialize()), 201