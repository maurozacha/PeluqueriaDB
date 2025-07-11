import logging
from logging.handlers import RotatingFileHandler
import os
import time
import socket
from flask_cors import CORS
import pyodbc
from flask import Flask, jsonify
from peluqueria_backend.exceptions.exceptions import register_error_handlers
from peluqueria_backend.extensions import db
from peluqueria_backend.config import Config
from sqlalchemy.exc import OperationalError, SQLAlchemyError

def check_database_connectivity(server):
    """Verifica la conectividad básica al servidor de base de datos"""
    if not server:
        print("Error: El servidor de BD no está configurado (None)")
        return False
    try:
        host = server.split(':')[0] 
        socket.create_connection((host, 1433), timeout=200)
        return True
    except socket.error as e:
        print(f"Error de conectividad con {host}: {str(e)}")
        return False

def test_direct_connection():
    """Prueba la conexión directa con pyodbc"""
    try:
        conn = pyodbc.connect(
            "Driver={ODBC Driver 17 for SQL Server};"
            f"Server={Config.DB_SERVER};"
            f"Database={Config.DB_NAME};"
            f"Uid={Config.DB_USER};"
            f"Pwd={Config.DB_PASSWORD};"
            "Encrypt=yes;"
            "TrustServerCertificate=no;"
            "Connection Timeout=30;"
        )
        conn.close()
        return True
    except Exception as e:
        print(f"Error en conexión directa: {str(e)}")
        return False

def create_app():
    app = Flask(__name__)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:9000"],  
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler(
        'logs/peluqueria.log',
        maxBytes=10240,
        backupCount=10
    )
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    
    app.logger.info('Aplicación inicializada')
    
    print("\n=== DIAGNÓSTICO INICIAL ===")
    print(f"Directorio actual: {os.getcwd()}")
    print(f"Archivo .env existe: {os.path.exists('.env')}")
    
    try:
        app.config.from_object(Config)
        print("Configuración cargada correctamente:")
        print(Config.show_config())
    except Exception as e:
        print("\n=== ERROR CRÍTICO ===")
        print(f"Tipo de error: {type(e).__name__}")
        print(f"Mensaje: {str(e)}")
        print("\nContenido de .env:")
        with open('.env', 'r') as f:
            print(f.read())
        raise

    print("SQLALCHEMY_DATABASE_URI:", app.config['SQLALCHEMY_DATABASE_URI'])

    if 'None' in app.config['SQLALCHEMY_DATABASE_URI']:
        raise ValueError("La cadena de conexión contiene valores None. Verifica .env")
    
    if not app.config.get('DB_SERVER'):
        raise ValueError("DB_SERVER no está configurado. Verifica tu archivo .env o variables de entorno.")
    
    print("Configuración de DB cargada:", {
        'DB_SERVER': app.config['DB_SERVER'],
        'DB_NAME': app.config['DB_NAME'],
        'DB_USER': app.config['DB_USER']
    })

    if not check_database_connectivity(app.config['DB_SERVER']):
        app.logger.error("No se puede establecer conexión básica con el servidor de BD")
        if not test_direct_connection():
            app.logger.error("Fallo en conexión directa con pyodbc - Verifica credenciales y configuración")
    
    db.init_app(app)
    
    register_error_handlers(app)
    
    max_retries = 5  
    retry_delay = 10  
    
    for attempt in range(max_retries):
        try:
            with app.app_context():
                from peluqueria_backend.models import (
                    Persona, Usuario, Cliente, Empleado,
                    Servicio, Turno, Pago, Telefono
                )
                db.create_all()
                app.logger.info("Conexión a la base de datos establecida correctamente")
                break
                
        except OperationalError as e:
            app.logger.error(f"Intento {attempt + 1} fallido: {str(e)}")
            if attempt == max_retries - 1:
                app.logger.error("No se pudo conectar a la base de datos después de varios intentos")

                with open('db_connection_error.log', 'w') as f:
                    f.write(f"Error final de conexión: {str(e)}\n")
                    f.write(f"Configuración usada:\n")
                    f.write(f"Server: {app.config['DB_SERVER']}\n")
                    f.write(f"Database: {app.config['DB_NAME']}\n")
                    f.write(f"User: {app.config['DB_USER']}\n")
                raise
    
    from peluqueria_backend.routes.authRoute import auth_bp
    from peluqueria_backend.routes.turnoRoute import turnos_blueprint
    from peluqueria_backend.routes.servicioRoute import servicios_blueprint
    from peluqueria_backend.routes.empleadoRoute import empleado_bp
    from peluqueria_backend.routes.clienteRoute import cliente_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(turnos_blueprint, url_prefix="/turnos")
    app.register_blueprint(servicios_blueprint, url_prefix="/servicios")
    app.register_blueprint(empleado_bp, url_prefix="/empleados")
    app.register_blueprint(cliente_bp, url_prefix="/clientes")
    
    @app.route('/health')
    def health_check():
        try:
            db.session.execute('SELECT 1')
            return jsonify({
                'status': 'healthy',
                'database': 'connected',
                'server': app.config['DB_SERVER'],
                'database_name': app.config['DB_NAME']
            }), 200
        except SQLAlchemyError as e:
            return jsonify({
                'status': 'unhealthy',
                'database': 'disconnected',
                'error': str(e),
                'server': app.config['DB_SERVER'],
                'database_name': app.config['DB_NAME']
            }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='localhost',
        port=int(os.getenv("PORT", 8080)),
        debug=app.config.get('DEBUG', False)
    )