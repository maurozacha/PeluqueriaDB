from flask import Flask
from extensions import db
from routes.cliente_routes import cliente_bp

app = Flask(__name__)
app.config.from_object('config.Config')
db.init_app(app)

app.register_blueprint(cliente_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)