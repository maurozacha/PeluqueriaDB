from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.repositories.clienteRepository import ClienteRepository
from peluqueria_backend.repositories.usuarioRepository import UsuarioRepository
from peluqueria_backend.services.authService import AuthService
import logging
from flask_cors import CORS

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth_bp', __name__)
CORS(auth_bp) 
auth_service = AuthService()

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logger.info(f"Intento de login para usuario: {data.get('usuario')}")
        
        token,user_data = auth_service.login(data.get('usuario'), data.get('contrasena'))
        
        logger.info(f"Login exitoso para usuario: {data.get('usuario')}")
        return jsonify({'token': token , 'user': user_data}), 200
        
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
        
        required_fields = ['usuario', 'contrasena', 'nombre', 'apellido', 'email', 'dni']
        if not all(field in data for field in required_fields):
            raise APIError(f"Faltan campos requeridos: {required_fields}", status_code=400)
        
        if ClienteRepository.existe_cliente(data.get('email'), data.get('dni')):
            raise APIError("Ya existe un cliente con ese email o DNI", status_code=409)
        
        if UsuarioRepository.existe_usuario(data.get('usuario')):
            raise APIError("El nombre de usuario ya está en uso", status_code=409)
        
        from peluqueria_backend.models.cliente import Cliente
        nueva_persona = Cliente(
            nombre=data.get('nombre'),
            apellido=data.get('apellido'),
            email=data.get('email'),
            dni=data.get('dni'),
            tipo_persona='CLIENTE',
            usuario_alta=data.get('usuario')
        )  
        
        persona_creada = ClienteRepository.create(nueva_persona)
        
        token, user_data = auth_service.register(
            usuario=data.get('usuario'),
            contrasena=data.get('contrasena'),
            role='CLIENTE',  
            persona_id=persona_creada.ID,
            usuario_alta=data.get('usuario')
        )
        
        logger.info(f"Usuario registrado exitosamente: {data.get('usuario')}")
        return jsonify({
            'token': token,
            'user': user_data,
            'message': 'Registro exitoso',
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
def logout():  
    try:
        current_user = request.user 
        logger.info(f"Usuario {current_user.get('user')} realizó logout")
        return jsonify({'message': 'Logout exitoso. Token eliminado.'}), 200
    except Exception as e:
        logger.error(f"Error durante logout: {str(e)}", exc_info=True)
        return jsonify({'message': 'Error interno durante logout'}), 500