from functools import wraps
from flask import request, jsonify
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from peluqueria_backend.config import Config  # Cambio aquí
from peluqueria_backend.models.usuario import Usuario  # Cambio aquí
from peluqueria_backend.extensions import db  # Cambio aquí

class AuthManager:
    _instance = None
    
    SECRET_KEY = Config.SECRET_KEY

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AuthManager, cls).__new__(cls)
        return cls._instance
    
    def login(self, usuario, contrasena):
        usuario = Usuario.query.filter_by(USUARIO=usuario).first()
        
        if usuario and check_password_hash(usuario.contrasena, contrasena) and usuario.ACTIVO:
            token = jwt.encode({
                'user': usuario,
                'role': usuario.ROL,
                'persona_id': usuario.PERSONA_ID,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
            }, self.SECRET_KEY, algorithm='HS256')  # Cambio aquí (self.SECRET_KEY)
            return token
        return None
    
    def verify_token(self, token):
        try:
            data = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])  # Cambio aquí
            return data
        except:
            return None
    
    def create_user(self, usuario, contrasena, role, persona_id, usuario_alta):
        if Usuario.query.filter_by(USUARIO=usuario).first():
            return False
            
        nuevo_usuario = Usuario(
            USUARIO=usuario,
            CONTRASENA=generate_password_hash(contrasena),
            ROL=role,
            PERSONA_ID=persona_id,
            USUARIO_ALTA=usuario_alta
        )
        
        db.session.add(nuevo_usuario)
        db.session.commit()
        return True