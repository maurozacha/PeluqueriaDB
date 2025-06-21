from werkzeug.security import generate_password_hash, check_password_hash
from repositories.usuarioRepository import UsuarioRepository
from models.usuario import Usuario
import jwt
import datetime
from config import Config  

class AuthService:
    SECRET_KEY = Config.SECRET_KEY  

    def login(self, username, password):
        usuario = UsuarioRepository.obtener_por_usuario(username)
        if usuario and check_password_hash(usuario.CONTRASENA, password) and usuario.ACTIVO:
            token = jwt.encode({
                'user': username,
                'role': usuario.ROL,
                'persona_id': usuario.PERSONA_ID,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
            }, self.SECRET_KEY, algorithm='HS256')  
            return token
        return None

    def register(self, username, password, role, persona_id, usuario_alta):
        if UsuarioRepository.existe_usuario(username):
            return False
        nuevo_usuario = Usuario(
            USUARIO=username,
            CONTRASENA=generate_password_hash(password),
            ROL=role,
            PERSONA_ID=persona_id,
            USUARIO_ALTA=usuario_alta
        )
        UsuarioRepository.crear_usuario(nuevo_usuario)
        return True

    def verify_token(self, token):
        try:
            data = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
            return data
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
