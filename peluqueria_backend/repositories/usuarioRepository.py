from peluqueria_backend.extensions import db
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
