from flask import Blueprint, request, jsonify
from peluqueria_backend.auth.decorators import token_required
from peluqueria_backend.services.authService import AuthService

auth_bp = Blueprint('auth_bp', __name__)
auth_service = AuthService()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    token = auth_service.login(data.get('usuario'), data.get('contrasena'))
    if token:
        return jsonify({'token': token})
    return jsonify({'message': 'Credenciales inválidas o usuario inactivo'}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    exito = auth_service.register(
        usuario=data.get('usuario'),
        contrasena=data.get('contrasena'),
        role=data.get('rol'),
        persona_id=data.get('persona_id'),
        usuario_alta=data.get('usuario_alta')
    )
    if exito:
        return jsonify({'message': 'Usuario creado exitosamente'}), 201
    return jsonify({'message': 'Usuario ya existe'}), 409

@auth_bp.route('/verify', methods=['POST'])
def verify():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token requerido'}), 401
    token = token.replace('Bearer ', '')
    decoded = auth_service.verify_token(token)
    if decoded:
        return jsonify({'valid': True, 'data': decoded})
    return jsonify({'valid': False}), 401

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    return jsonify({'message': 'Logout exitoso. Eliminá el token en el frontend.'}), 200
