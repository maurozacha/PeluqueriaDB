from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.clienteService import ClienteService
import logging

logger = logging.getLogger(__name__)
cliente_bp = Blueprint('cliente_bp', __name__)

@cliente_bp.route('/get', methods=['GET'])
@token_required
def get_clientes():
    try:
        clientes = ClienteService.listar_clientes()
        logger.info("Listado de clientes obtenido correctamente")
        return jsonify({
            'success': True,
            'data': [c.serialize() for c in clientes],
            'count': len(clientes)
        })
    except APIError as e:
        logger.error(f"Error al listar clientes: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@cliente_bp.route('/create', methods=['POST'])
@token_required
def crear_cliente():
    try:
        data = request.json
        if not data:
            raise APIError("No se proporcionaron datos", status_code=400)
            
        cliente = ClienteService.crear_cliente(data)
        logger.info(f"Cliente {cliente.nombre} {cliente.apellido} creado con éxito")
        return jsonify({
            'success': True,
            'message': f'Cliente {cliente.nombre} {cliente.apellido} registrado con éxito!',
            'data': cliente.serialize()
        }), 201
    except APIError as e:
        logger.error(f"Error al crear cliente: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@cliente_bp.route('/getone', methods=['GET'])
@token_required
def obtener_cliente():
    try:
        cliente_id = request.args.get('id', type=int)
        dni = request.args.get('dni', type=str)
        
        if not cliente_id and not dni:
            raise APIError("Se requiere parámetro 'id' o 'dni'", status_code=400)
            
        identifier = cliente_id if cliente_id else dni
        cliente = ClienteService.obtener_cliente(identifier)
        
        logger.info(f"Cliente obtenido correctamente (identificador: {identifier})")
        return jsonify({
            'success': True,
            'data': cliente.serialize()
        })
        
    except APIError as e:
        logger.error(f"Error al obtener cliente: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@cliente_bp.route('/update', methods=['PUT'])
@token_required
def actualizar_cliente():
    try:
        data = request.json
        if not data or 'id' not in data:
            raise APIError("Datos de cliente no proporcionados o falta ID", status_code=400)
            
        cliente_id = data['id']
        datos_actualizacion = {k: v for k, v in data.items() if k != 'id'}
        
        cliente_actualizado = ClienteService.actualizar_cliente(cliente_id, datos_actualizacion)
        
        logger.info(f"Cliente {cliente_id} actualizado correctamente")
        return jsonify({
            'success': True,
            'message': f'Cliente {cliente_actualizado.nombre} {cliente_actualizado.apellido} actualizado con éxito!',
            'data': cliente_actualizado.serialize()
        })
    except APIError as e:
        logger.error(f"Error al actualizar cliente: {e.message}")
        return jsonify(e.to_dict()), e.status_code