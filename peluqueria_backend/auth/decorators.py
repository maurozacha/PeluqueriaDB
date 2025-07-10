from functools import wraps
from flask import request, jsonify
from peluqueria_backend.auth.auth import AuthManager  

auth_manager = AuthManager() 

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        token = token.replace('Bearer ', '')
        data = auth_manager.verify_token(token)
        if not data:
            return jsonify({'message': 'Token is invalid or expired!'}), 401

        request.user = data
        return f(*args, **kwargs)
    return decorated

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401

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