from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.empleadoService import EmpleadoService
import logging

logger = logging.getLogger(__name__)
empleado_bp = Blueprint('empleado_bp', __name__)

@empleado_bp.route('/create', methods=['POST'])
@token_required
def crear_empleado():
    try:
        data = request.json
        if not data:
            raise APIError("No se proporcionaron datos", status_code=400)
            
        empleado = EmpleadoService.crear_empleado(data)
        logger.info(f"Empleado {empleado.nombre} {empleado.apellido} creado con éxito")
        return jsonify({
            'success': True,
            'message': f'Empleado {empleado.nombre} {empleado.apellido} registrado con éxito!',
            'data': empleado.serialize()
        }), 201
    except APIError as e:
        logger.error(f"Error al crear empleado: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@empleado_bp.route('/<int:empleado_id>', methods=['GET'])
@token_required
def obtener_empleado(empleado_id):
    try:
        empleado = EmpleadoService.obtener_empleado_por_id(empleado_id)
        logger.info(f"Empleado {empleado_id} obtenido correctamente")
        return jsonify({
            'success': True,
            'data': empleado.serialize()
        })
    except APIError as e:
        logger.error(f"Error al obtener empleado {empleado_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@empleado_bp.route('/listar', methods=['GET'])
@token_required
def listar_empleados():
    try:
        empleados = EmpleadoService.listar_empleados()
        logger.info("Listado de empleados obtenido correctamente")
        return jsonify({
            'success': True,
            'data': [e.serialize() for e in empleados],
            'count': len(empleados)
        })
    except APIError as e:
        logger.error(f"Error al listar empleados: {e.message}")
        return jsonify(e.to_dict()), e.status_code
    
@empleado_bp.route('/update', methods=['PUT'])
@token_required
def actualizar_empleado():
    try:
        data = request.json
        if not data or 'id' not in data:
            raise APIError("Datos de empleado no proporcionados o falta ID", status_code=400)
            
        empleado_id = data['id']
        datos_actualizacion = {k: v for k, v in data.items() if k != 'id'}
        
        empleado_actualizado = EmpleadoService.actualizar_empleado(empleado_id, datos_actualizacion)
        
        logger.info(f"Empleado {empleado_id} actualizado correctamente")
        return jsonify({
            'success': True,
            'message': f'Empleado {empleado_actualizado.nombre} {empleado_actualizado.apellido} actualizado con éxito!',
            'data': empleado_actualizado.serialize()
        })
    except APIError as e:
        logger.error(f"Error al actualizar empleado: {e.message}")
        return jsonify(e.to_dict()), e.status_code