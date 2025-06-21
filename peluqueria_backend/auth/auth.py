from functools import wraps
from flask import request, jsonify
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import SECRET_KEY
from models.usuario import Usuario
from extensions import db

class AuthManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AuthManager, cls).__new__(cls)
        return cls._instance
    
    def login(self, username, password):
        usuario = Usuario.query.filter_by(USUARIO=username).first()
        
        if usuario and check_password_hash(usuario.CONTRASENA, password) and usuario.ACTIVO:
            token = jwt.encode({
                'user': username,
                'role': usuario.ROL,
                'persona_id': usuario.PERSONA_ID,
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
    
    def create_user(self, username, password, role, persona_id, usuario_alta):
        if Usuario.query.filter_by(USUARIO=username).first():
            return False
            
        nuevo_usuario = Usuario(
            USUARIO=username,
            CONTRASENA=generate_password_hash(password),
            ROL=role,
            PERSONA_ID=persona_id,
            USUARIO_ALTA=usuario_alta
        )
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        return True

auth_manager = AuthManager()