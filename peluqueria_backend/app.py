from flask import Flask
from extensions import db
from config import Config
from routes import auth_blueprint
from routes import turnos_blueprint
from routes import servicios_blueprint

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(turnos_blueprint)
    app.register_blueprint(servicios_blueprint)
    
    @app.route('/')
    def home():
        return {'message': 'Bienvenido al sistema de turnos de peluquería'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)