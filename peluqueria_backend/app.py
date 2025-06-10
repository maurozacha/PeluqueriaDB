from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models.cliente import Cliente
from models.servicio import Servicio
from models.turno import Turno

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from routes import appointments, clients

if __name__ == '__main__':
    app.run(debug=True)