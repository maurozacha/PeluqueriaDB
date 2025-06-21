from models.usuario import Usuario
from extensions import db

class UsuarioRepository:
    @staticmethod
    def obtener_por_usuario(username):
        return Usuario.query.filter_by(USUARIO=username).first()

    @staticmethod
    def crear_usuario(usuario):
        db.session.add(usuario)
        db.session.commit()

    @staticmethod
    def existe_usuario(username):
        return Usuario.query.filter_by(USUARIO=username).first() is not None
