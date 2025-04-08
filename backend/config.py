import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key_not_secure')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_dev_key_not_secure')
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # 30 days
    MONGO_URI = os.environ.get(
        'MONGO_URI', 
        'mongodb+srv://syedarija02:5hMe1v623zHetK1Q@donor-app.jet0b3m.mongodb.net/?retryWrites=true&w=majority&appName=donor-app'
    )

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    # MongoDB doesn't use URI like SQLAlchemy, so you don't need a `SQLALCHEMY_DATABASE_URI`.
    # MONGO_URI is enough to define the connection.

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # MongoDB URI for production (from the environment variable)
    MONGO_URI = os.environ.get('MONGO_URI')

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    # MongoDB URI for testing (you can specify a different database for tests)
    MONGO_URI = os.environ.get('TEST_MONGO_URI', 'mongodb+srv://syedarija02:5hMe1v623zHetK1Q@donor-app.jet0b3m.mongodb.net/donor-plus?retryWrites=true&w=majority')

# Dictionary with different configuration environments
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
