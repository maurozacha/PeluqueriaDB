import pytest
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import Cliente
from peluqueria_backend.extensions import db
from app import app

@pytest.fixture
def test_app():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

def test_insert_cliente(test_app):
    with test_app.app_context():
        nuevo_cliente = Cliente(nombre="Juan Perez", email="juan@mail.com", telefono="123456789")
        db.session.add(nuevo_cliente)
        db.session.commit()

        cliente = Cliente.query.filter_by(email="juan@mail.com").first()
        assert cliente is not None
        assert cliente.nombre == "Juan Perez"