from flask import Flask
from config import Config
from src.extensions import db
from flask_migrate import Migrate
from models.cliente import Cliente
from models.servicio import Servicio
from models.turno import Turno

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

@app.before_first_request
def create_tables():
    db.create_all()

from routes import appointments, clients

if __name__ == '__main__':
    app.run(debug=True)