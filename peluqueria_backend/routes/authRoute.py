from flask import Blueprint, request, jsonify
from auth import auth_manager
import datetime

auth_blueprint = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    token = auth_manager.login(username, password)
    if token:
        return jsonify({
            'token': token,
            'expires_in': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        })
    return jsonify({'message': 'Credenciales inválidas'}), 401

@auth_blueprint.route('/verify', methods=['POST'])
def verify():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'valid': False, 'message': 'Token no proporcionado'}), 400
    
    data = auth_manager.verify_token(token)
    if data:
        return jsonify({'valid': True, 'user': data['user'], 'role': data['role']})
    return jsonify({'valid': False, 'message': 'Token inválido o expirado'}), 401