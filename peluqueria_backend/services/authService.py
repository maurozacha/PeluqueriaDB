from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from peluqueria_backend.config import Config
from peluqueria_backend.models.usuario import Usuario
from peluqueria_backend.repositories.usuarioRepository import UsuarioRepository  

class AuthService:
    SECRET_KEY = Config.SECRET_KEY  

    def login(self, usuario, contrasena):
        usuario = UsuarioRepository.obtener_por_usuario(usuario)
        if usuario and check_password_hash(usuario.contrasena, contrasena) and usuario.activo:
            token = jwt.encode({
                'user': usuario.usuario,
                'role': usuario.rol,
                'persona_id': usuario.persona_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
            }, self.SECRET_KEY, algorithm='HS256')  
            return token
        return None

    def register(self, usuario, contrasena, role, persona_id, usuario_alta):
        if UsuarioRepository.existe_usuario(usuario):
            return False
        nuevo_usuario = Usuario(
            usuario=usuario,
            contrasena=generate_password_hash(contrasena),
            rol=role,
            persona_id=persona_id,
            usuario_alta=usuario_alta
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
