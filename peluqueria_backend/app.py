import os

from flask import Flask
from extensions import db
from config import Config
from routes.authRoute import auth_bp
from routes.turnoRoute import turnos_blueprint
from routes.servicioRoute import servicios_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(turnos_blueprint, url_prefix="/turnos")
    app.register_blueprint(servicios_blueprint, url_prefix="/servicios")
    
    @app.route('/')
    def home():
        return {'message': 'Bienvenido al sistema de turnos de peluquería'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='0.0.0.0',
        port=int(os.getenv("PORT", 8080)),
        debug=app.config.get('DEBUG', False)
    )
