from functools import wraps
from flask import request, jsonify
import jwt
import datetime
from config import SECRET_KEY

class AuthManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AuthManager, cls).__new__(cls)
            cls._instance.users = {
                'admin': {'password': 'admin123', 'role': 'admin'},
                'empleado': {'password': 'empleado123', 'role': 'empleado'}
            }
        return cls._instance
    
    def login(self, username, password):
        user = self.users.get(username)
        if user and user['password'] == password:
            token = jwt.encode({
                'user': username,
                'role': user['role'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
            }, SECRET_KEY, algorithm='HS256')
            return token
        return None
    
    def verify_token(self, token):
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return data
        except:
            return None

auth_manager = AuthManager()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        data = auth_manager.verify_token(token)
        if not data:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        data = auth_manager.verify_token(token)
        if not data or data['role'] != 'admin':
            return jsonify({'message': 'Admin access required!'}), 403
        
        return f(*args, **kwargs)
    return decorated