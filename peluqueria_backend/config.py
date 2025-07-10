import os
from pathlib import Path
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Carga absoluta del .env - ¡ESTA ES LA CLAVE!
env_path = Path(__file__).resolve().parent.parent / '.env'
if not env_path.exists():
    raise FileNotFoundError(f"Archivo .env no encontrado en: {env_path}")
load_dotenv(dotenv_path=env_path, override=True)

class Config:
    # Variables CRÍTICAS (sin valores por defecto)
    DB_SERVER = os.getenv('DB_SERVER')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')
    SECRET_KEY = os.getenv('SECRET_KEY')

    # Validación EXPLÍCITA
    if None in [DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME, SECRET_KEY]:
        missing = [k for k, v in {
            'DB_SERVER': DB_SERVER,
            'DB_USER': DB_USER,
            'DB_PASSWORD': DB_PASSWORD,
            'DB_NAME': DB_NAME,
            'SECRET_KEY': SECRET_KEY
        }.items() if v is None]
        raise ValueError(f"ERROR: Variables faltantes en .env: {missing}")

    # Construcción SEGURA de la cadena de conexión
    encoded_password = quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{DB_USER}:{encoded_password}@{DB_SERVER}:1433/{DB_NAME}"
        "?driver=ODBC+Driver+17+for+SQL+Server"
        "&Encrypt=yes"
        "&TrustServerCertificate=no"
        "&Connection+Timeout=30"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Método de diagnóstico
    @classmethod
    def show_config(cls):
        return {
            'DB_SERVER': cls.DB_SERVER,
            'DB_USER': cls.DB_USER,
            'DB_NAME': cls.DB_NAME,
            'URI': cls.SQLALCHEMY_DATABASE_URI[:60] + "..."
        }