import os
from dotenv import load_dotenv

load_dotenv()

class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY', '721dcf6a5e5bec3dbdab5c29115a2aa21a1341842d1611c1293434dc2846e96e')

    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_SERVER = os.getenv('DB_SERVER')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or (
        f"mssql+pyodbc://{DB_USER}:{DB_PASSWORD}@{DB_SERVER}:{DB_PORT}/{DB_NAME}"
        "?driver=ODBC+Driver+17+for+SQL+Server"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
