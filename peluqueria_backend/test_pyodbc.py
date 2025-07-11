from flask import app, jsonify
import pyodbc

conn_str = (
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=serverpeluqueria.database.windows.net,1433;"
    "DATABASE=PeluqueriaDB;"
    "UID=admindb;"
    "PWD=SQLServer2023!;"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)
try:
    conn = pyodbc.connect(conn_str, timeout=30)
    print("¡Conexión exitosa!")
    conn.close()
except Exception as e:
    print("Error:", e)



@app.route('/test-cors')
def test_cors():
    return jsonify({"message": "CORS está configurado correctamente"})