from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
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
        
        if not data.get('usuario') or not data.get('contrasena'):
            logger.warning("Faltan credenciales en la solicitud")
            return jsonify({'message': 'Usuario y contraseña son requeridos'}), 400
        
        token = auth_service.login(data.get('usuario'), data.get('contrasena'))
        
        if token:
            logger.info(f"Login exitoso para usuario: {data.get('usuario')}")
            return jsonify({'token': token})
        
        logger.warning(f"Login fallido para usuario: {data.get('usuario')}")
        return jsonify({'message': 'Credenciales inválidas o usuario inactivo'}), 401
    
    except Exception as e:
        logger.error(f"Error inesperado en login: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error interno del servidor'}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"Intento de registro para usuario: {data.get('usuario')}")
        
        required_fields = ['usuario', 'contrasena', 'rol']
        if not all(field in data for field in required_fields):
            logger.warning(f"Faltan campos requeridos: {required_fields}")
            return jsonify({'message': 'Faltan campos requeridos'}), 400
        
        exito = auth_service.register(
            usuario=data.get('usuario'),
            contrasena=data.get('contrasena'),
            role=data.get('rol'),
            persona_id=data.get('persona_id'),
            usuario_alta=data.get('usuario_alta')
        )
        
        if exito:
            logger.info(f"Usuario registrado exitosamente: {data.get('usuario')}")
            return jsonify({'message': 'Usuario creado exitosamente'}), 201
        
        logger.warning(f"El usuario ya existe: {data.get('usuario')}")
        return jsonify({'message': 'Usuario ya existe'}), 409
    
    except Exception as e:
        logger.error(f"Error inesperado en registro: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error interno del servidor'}), 500

@auth_bp.route('/verify', methods=['POST'])
def verify():
    try:
        token = request.headers.get('Authorization')
        
        if not token:
            logger.warning("Intento de verificación sin token")
            return jsonify({'message': 'Token requerido'}), 401
        
        logger.debug(f"Verificando token: {token[:15]}...")  
        token = token.replace('Bearer ', '')
        decoded = auth_service.verify_token(token)
        
        if decoded:
            logger.info(f"Token verificado para usuario: {decoded.get('sub')}")
            return jsonify({'valid': True, 'data': decoded})
        
        logger.warning("Token inválido o expirado")
        return jsonify({'valid': False}), 401
    
    except Exception as e:
        logger.error(f"Error en verificación de token: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error en verificación de token'}), 500

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    try:
        logger.info(f"Usuario {current_user.get('sub')} realizó logout")
        return jsonify({'message': 'Logout exitoso. Eliminá el token en el frontend.'}), 200
    except Exception as e:
        logger.error(f"Error durante logout: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error interno durante logout'}), 500