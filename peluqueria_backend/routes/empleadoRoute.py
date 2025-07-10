from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.services.empleadoService import EmpleadoService

empleado_bp = Blueprint('empleado_bp', __name__)

@empleado_bp.route('/create', methods=['POST'])
def crear_empleado():
    data = request.get_json()
    empleado = EmpleadoService.crear_empleado(data)
    return jsonify(empleado.serialize()), 201

@empleado_bp.route('/<int:empleado_id>', methods=['GET'])
@token_required
def obtener_empleado(empleado_id):
    empleado = EmpleadoService.obtener_empleado_por_id(empleado_id)
    if not empleado:
        return jsonify({'error': 'Empleado no encontrado'}), 404
    return jsonify(empleado.serialize())

@empleado_bp.route('/listar', methods=['GET'])
@token_required
def listar_empleados():
    empleados = EmpleadoService.listar_empleados()
    return jsonify([e.serialize() for e in empleados])