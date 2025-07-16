from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from peluqueria_backend.config import Config
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.models.usuario import Usuario
from peluqueria_backend.repositories.usuarioRepository import UsuarioRepository  

class AuthService:
    SECRET_KEY = Config.SECRET_KEY  

    def login(self, usuario, contrasena):
        if not usuario or not contrasena:
            raise APIError("Usuario y contraseña son requeridos", status_code=400)

        usuario_db = UsuarioRepository.obtener_por_usuario(usuario)

        if not usuario_db:
            raise APIError("Credenciales inválidas", status_code=401)

        if not check_password_hash(usuario_db.contrasena, contrasena):
            raise APIError("Credenciales inválidas", status_code=401)

        if not usuario_db.activo:
            raise APIError("Usuario inactivo", status_code=403)

        token = jwt.encode({
            'user': usuario_db.usuario,
            'role': usuario_db.rol,
            'persona_id': usuario_db.persona_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        }, self.SECRET_KEY, algorithm='HS256')

        user_data = {
            'usuario': usuario_db.usuario,
            'rol': usuario_db.rol,
            'persona_id': usuario_db.persona_id,
            'activo': usuario_db.activo,
            'usuario_alta': usuario_db.usuario_alta,
            'fecha_alta': usuario_db.fecha_alta.strftime('%Y-%m-%d %H:%M:%S') if usuario_db.fecha_alta else None
        }

        return token, user_data

    def register(self, usuario, contrasena, role, persona_id, usuario_alta):
        if UsuarioRepository.existe_usuario(usuario):
            raise APIError("El usuario ya existe", status_code=409)

        nuevo_usuario = Usuario(
            usuario=usuario,
            contrasena=generate_password_hash(contrasena),
            rol=role,
            persona_id=persona_id,
            usuario_alta=usuario_alta,
            activo=True
        )

        UsuarioRepository.crear_usuario(nuevo_usuario)

        token = jwt.encode({
            'user': nuevo_usuario.usuario,
            'role': nuevo_usuario.rol,
            'persona_id': nuevo_usuario.persona_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=8)
        }, self.SECRET_KEY, algorithm='HS256')

        user_data = {
            'usuario': nuevo_usuario.usuario,
            'rol': nuevo_usuario.rol,
            'persona_id': nuevo_usuario.persona_id,
            'activo': nuevo_usuario.activo,
            'usuario_alta': nuevo_usuario.usuario_alta
        }
    
        return token, user_data

    def verify_token(self, token):
        try:
            data = jwt.decode(token, self.SECRET_KEY, algorithms=['HS256'])
            return data
        except jwt.ExpiredSignatureError:
            raise APIError("Token expirado", status_code=401)
        except jwt.InvalidTokenError:
            raise APIError("Token inválido", status_code=401)