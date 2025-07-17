import datetime
from peluqueria_backend.exceptions.exceptions import APIError
from peluqueria_backend.extensions import db
from peluqueria_backend.models.persona import Persona
from peluqueria_backend.models.usuario import Usuario

class UsuarioRepository:
    @staticmethod
    def obtener_por_usuario(usuario):
        return Usuario.query.filter_by(usuario=usuario).first()

    @staticmethod
    def crear_usuario(usuario):
        db.session.add(usuario)
        db.session.commit()

    @staticmethod
    def existe_usuario(usuario):
      return Usuario.query.filter_by(usuario=usuario).first() is not None 


    @staticmethod
    def obtener_todos_excepto(usuario_admin):
        try:
            results = db.session.query(
                Persona.ID,
                Usuario.usuario,
                Usuario.activo,
                Usuario.rol,
                Persona.nombre,
                Persona.apellido,
                Persona.dni,
                Persona.email
            ).join(Persona).filter(
                Usuario.usuario != usuario_admin
            ).all()

            return [{
                'id': ID,
                'usuario': usuario,
                'activo': activo,
                'rol': rol,
                'nombre': nombre,
                'apellido': apellido,
                'dni': dni,
                'email': email
            } for ID,usuario, activo, rol, nombre, apellido, dni, email in results]

        except Exception as e:
            db.session.rollback()
            raise APIError(
                "Error inesperado al obtener usuarios",
                status_code=500,
                payload={
                    'details': str(e),
                    'error_type': 'unexpected_error'
                }
            )
    
    @staticmethod
    def actualizar_rol(usuario, nuevo_rol):
        try:
            persona_id = int(usuario)

            usuario_db = Usuario.query.filter_by(persona_id=persona_id).first()
            if not usuario_db:
                return None

            usuario_db.rol = nuevo_rol
            
            db.session.commit()
            return usuario_db

        except (ValueError, TypeError):
            return None