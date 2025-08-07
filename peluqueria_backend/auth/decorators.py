from functools import wraps
from flask import request, jsonify
import jwt
from peluqueria_backend.auth.auth import AuthManager
from peluqueria_backend.config import Config

auth_manager = AuthManager()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Permitir preflight sin token
        if request.method == 'OPTIONS':
            return '', 200

        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return jsonify({'message': 'Token faltante'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            request.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401

        return f(*args, **kwargs)

    return decorated


def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'message': 'No se encuentra logeado en el sistema'}), 401

            token = token.replace('Bearer ', '')
            data = auth_manager.verify_token(token)
            if not data or data['role'] != role:
                return jsonify({'message': f'{role} access required!'}), 403

            request.user = data
            return f(*args, **kwargs)
        return decorated
    return decorator

admin_required = role_required('admin')
empleado_required = role_required('empleado')
cliente_required = role_required('cliente')