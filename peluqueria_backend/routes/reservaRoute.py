from flask import Blueprint, jsonify, request
from services.reservaService import ReservaService

reserva_bp = Blueprint('reserva', __name__)

@reserva_bp.route('/reservas', methods=['GET'])
def listar_reservas():
    reservas = ReservaService.listar_reservas()
    return jsonify([r.serialize() for r in reservas])

@reserva_bp.route('/reservas/<int:reserva_id>', methods=['GET'])
def obtener_reserva(reserva_id):
    reserva = ReservaService.obtener_reserva_por_id(reserva_id)
    if not reserva:
        return jsonify({'error': 'Reserva no encontrada'}), 404
    return jsonify(reserva.serialize())

@reserva_bp.route('/reservas', methods=['POST'])
def crear_reserva():
    data = request.get_json()
    reserva = ReservaService.crear_reserva(data)
    return jsonify(reserva.serialize()), 201

@reserva_bp.route('/reservas/<int:reserva_id>', methods=['PUT'])
def modificar_reserva(reserva_id):
    data = request.get_json()
    reserva = ReservaService.modificar_reserva(reserva_id, data)
    if not reserva:
        return jsonify({'error': 'Reserva no encontrada'}), 404
    return jsonify(reserva.serialize())

@reserva_bp.route('/reservas/<int:reserva_id>', methods=['DELETE'])
def cancelar_reserva(reserva_id):
    reserva = ReservaService.cancelar_reserva(reserva_id)
    if not reserva:
        return jsonify({'error': 'Reserva no encontrada'}), 404
    return jsonify({'message': 'Reserva cancelada'})