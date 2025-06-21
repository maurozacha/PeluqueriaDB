from flask import Blueprint, request, jsonify
from services import ClienteService

cliente_bp = Blueprint('cliente_bp', __name__)

@cliente_bp.route('/clientes', methods=['GET'])
def get_clientes():
    clientes = ClienteService.listar_clientes()
    return jsonify([c.serialize() for c in clientes])

@cliente_bp.route('/clientes', methods=['POST'])
def crear_cliente():
    data = request.json
    cliente = ClienteService.crear_cliente(data)
    return jsonify(cliente.serialize()), 201