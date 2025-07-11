from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.services.authService import AuthService
import logging

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth_bp', __name__)
auth_service = AuthService()

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logger.info(f"Intento de login para usuario: {data.get('usuario')}")
        
        token = auth_service.login(data.get('usuario'), data.get('contrasena'))
        
        logger.info(f"Login exitoso para usuario: {data.get('usuario')}")
        return jsonify({'token': token})
        
    except APIError as e:
        logger.warning(f"Error en login: {e.message}")
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        logger.error(f"Error inesperado en login: {str(e)}", exc_info=True)
        return jsonify({
            'message': 'Error interno del servidor',
            'status_code': 500
        }), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"Intento de registro para usuario: {data.get('usuario')}")
        
        required_fields = ['usuario', 'contrasena', 'rol']
        if not all(field in data for field in required_fields):
            raise APIError(f"Faltan campos requeridos: {required_fields}", status_code=400)
        
        auth_service.register(
            usuario=data.get('usuario'),
            contrasena=data.get('contrasena'),
            role=data.get('rol'),
            persona_id=data.get('persona_id'),
            usuario_alta=data.get('usuario_alta')
        )
        
        logger.info(f"Usuario registrado exitosamente: {data.get('usuario')}")
        return jsonify({
            'message': 'Usuario creado exitosamente',
            'status_code': 201
        }), 201
        
    except APIError as e:
        logger.warning(f"Error en registro: {e.message}")
        return jsonify(e.to_dict()), e.status_code
    except Exception as e:
        logger.error(f"Error inesperado en registro: {str(e)}", exc_info=True)
        return jsonify({
            'message': 'Error interno del servidor',
            'status_code': 500
        }), 500

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    try:
        logger.info(f"Usuario {current_user.get('sub')} realizó logout")
        return jsonify({'message': 'Logout exitoso. Eliminá el token en el frontend.'}), 200
    except Exception as e:
        logger.error(f"Error durante logout: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error interno durante logout'}), 500