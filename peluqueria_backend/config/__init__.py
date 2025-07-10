import os

env = os.getenv('FLASK_ENV', 'development')

if env == 'production':
    from .prod import ProdConfig as Config
else:
    from .dev import DevConfig as Config

Config.show_config = classmethod(lambda cls: {
    'DB_SERVER': cls.DB_SERVER,
    'DB_USER': cls.DB_USER,
    'DB_NAME': cls.DB_NAME,
    'DEBUG': getattr(cls, 'DEBUG', False)
})