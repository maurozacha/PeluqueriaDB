from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.pagoService import PagoService
import logging

logger = logging.getLogger(__name__)
pago_bp = Blueprint('pago_bp', __name__)

@pago_bp.route('/<int:pago_id>', methods=['GET'])
@token_required
def obtener_pago(pago_id):
    try:
        pago = PagoService.obtener_pago_por_id(pago_id)
        return jsonify({
            'success': True,
            'data': pago.serialize()
        })
    except APIError as e:
        logger.error(f"Error al obtener pago {pago_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@pago_bp.route('/turno/<int:turno_id>', methods=['GET'])
@token_required
def obtener_pagos_por_turno(turno_id):
    try:
        pagos = PagoService.obtener_pagos_por_turno(turno_id)
        return jsonify({
            'success': True,
            'data': [p.serialize() for p in pagos],
            'count': len(pagos)
        })
    except APIError as e:
        logger.error(f"Error al obtener pagos para turno {turno_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code

@pago_bp.route('/<int:pago_id>/cancelar', methods=['PUT'])
@token_required
def cancelar_pago(pago_id):
    try:
        pago = PagoService.cancelar_pago(pago_id)
        return jsonify({
            'success': True,
            'message': 'Pago cancelado exitosamente',
            'data': pago.serialize()
        })
    except APIError as e:
        logger.error(f"Error al cancelar pago {pago_id}: {e.message}")
        return jsonify(e.to_dict()), e.status_code