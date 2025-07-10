import os
import time
import socket
import pyodbc
from flask import Flask, jsonify
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
    
    # DEBUG: Verificar carga de .env
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

    # Debug: Imprimir la URI de conexión completa
    print("SQLALCHEMY_DATABASE_URI:", app.config['SQLALCHEMY_DATABASE_URI'])

    # Validar que la URI no contenga 'None'
    if 'None' in app.config['SQLALCHEMY_DATABASE_URI']:
        raise ValueError("La cadena de conexión contiene valores None. Verifica .env")
    
    # Validación de configuración crítica
    if not app.config.get('DB_SERVER'):
        raise ValueError("DB_SERVER no está configurado. Verifica tu archivo .env o variables de entorno.")
    
    # Opcional: Imprime la configuración para depuración
    print("Configuración de DB cargada:", {
        'DB_SERVER': app.config['DB_SERVER'],
        'DB_NAME': app.config['DB_NAME'],
        'DB_USER': app.config['DB_USER']
    })

    # Verificación de conectividad antes de iniciar
    if not check_database_connectivity(app.config['DB_SERVER']):
        app.logger.error("No se puede establecer conexión básica con el servidor de BD")
        if not test_direct_connection():
            app.logger.error("Fallo en conexión directa con pyodbc - Verifica credenciales y configuración")
    
    # Inicializar la base de datos con reintentos mejorados
    db.init_app(app)
    
    max_retries = 5  # Aumentamos los reintentos
    retry_delay = 10  # Aumentamos el tiempo de espera
    
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
                # Crear archivo de error para diagnóstico
                with open('db_connection_error.log', 'w') as f:
                    f.write(f"Error final de conexión: {str(e)}\n")
                    f.write(f"Configuración usada:\n")
                    f.write(f"Server: {app.config['DB_SERVER']}\n")
                    f.write(f"Database: {app.config['DB_NAME']}\n")
                    f.write(f"User: {app.config['DB_USER']}\n")
                raise
    
    # Registrar blueprints
    from peluqueria_backend.routes.authRoute import auth_bp
    from peluqueria_backend.routes.turnoRoute import turnos_blueprint
    from peluqueria_backend.routes.servicioRoute import servicios_blueprint
    from peluqueria_backend.routes.empleadoRoute import empleado_bp
    
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(turnos_blueprint, url_prefix="/turnos")
    app.register_blueprint(servicios_blueprint, url_prefix="/servicios")
    app.register_blueprint(empleado_bp, url_prefix="/empleados")
    
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
        host='0.0.0.0',
        port=int(os.getenv("PORT", 8080)),
        debug=app.config.get('DEBUG', False)
    )