from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required, admin_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.servicioService import ServicioService
import logging

logger = logging.getLogger(__name__)
servicio_bp = Blueprint('servicio_bp', __name__)

@servicio_bp.route('/', methods=['GET'])
@token_required
def listar_servicios():
    """Obtiene todos los servicios disponibles"""
    try:
        activos = request.args.get('activos', 'true').lower() == 'true'
        servicios = ServicioService.listar_servicios(activos=activos)
        return jsonify({
            'success': True,
            'data': [s.serialize() for s in servicios],
            'count': len(servicios)
        })
    except APIError as e:
        logger.error(f"Error al listar servicios: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@servicio_bp.route('/<int:servicio_id>', methods=['GET'])
@token_required
def obtener_servicio(servicio_id):
    """Obtiene un servicio específico por su ID"""
    try:
        servicio = ServicioService.obtener_servicio_por_id(servicio_id)
        return jsonify({
            'success': True,
            'data': servicio.serialize()
        })
    except APIError as e:
        logger.error(f"Error al obtener servicio {servicio_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@servicio_bp.route('/', methods=['POST'])
@token_required
@admin_required
def crear_servicio():
    """Crea un nuevo servicio (solo administradores)"""
    try:
        data = request.get_json()
        servicio = ServicioService.crear_servicio(
            nombre=data['nombre'],
            precio=data['precio'],
            duracion_estimada=data.get('duracion_estimada', 30),
            descripcion=data.get('descripcion'),
            especialidad=data.get('especialidad'),
            usuario_alta=data.get('usuario_alta')
        )
        return jsonify({
            'success': True,
            'message': 'Servicio creado exitosamente',
            'data': servicio.serialize()
        }), 201
    except APIError as e:
        logger.error(f"Error al crear servicio: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@servicio_bp.route('/empleado/<int:empleado_id>', methods=['GET'])
@token_required
def obtener_servicios_por_empleado(empleado_id):
    """Obtiene los servicios disponibles para un empleado específico"""
    try:
        servicios = ServicioService.obtener_servicios_por_empleado(empleado_id)
        return jsonify({
            'success': True,
            'data': [s.serialize() for s in servicios],
            'count': len(servicios)
        })
    except APIError as e:
        logger.error(f"Error al obtener servicios para empleado {empleado_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code