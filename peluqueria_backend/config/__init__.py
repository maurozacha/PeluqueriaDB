import os

env = os.getenv('FLASK_ENV', 'development')

if env == 'production':
    from config.prod import ProdConfig as Config
else:
    from config.dev import DevConfig as Config
