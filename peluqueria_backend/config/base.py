import os
from urllib.parse import quote_plus
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY')

    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_SERVER = os.getenv('DB_SERVER')
    DB_NAME = os.getenv('DB_NAME')
    DB_PORT = os.getenv('DB_PORT', '1433')

    if None in [DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME]:
        missing = [k for k, v in {
            'DB_SERVER': DB_SERVER,
            'DB_USER': DB_USER,
            'DB_PASSWORD': DB_PASSWORD,
            'DB_NAME': DB_NAME
        }.items() if v is None]
        raise ValueError(f"Faltan variables de entorno: {missing}")

    encoded_password = quote_plus(DB_PASSWORD)
    SQLALCHEMY_DATABASE_URI = (
        f"mssql+pyodbc://{DB_USER}:{encoded_password}@{DB_SERVER}:{DB_PORT}/{DB_NAME}"
        "?driver=ODBC+Driver+17+for+SQL+Server"
        "&Encrypt=yes"
        "&TrustServerCertificate=no"
        "&Connection+Timeout=30"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False