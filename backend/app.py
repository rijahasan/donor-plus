# from flask import Flask
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# from flask_sqlalchemy import SQLAlchemy
# import os

# # Initialize extensions
# db = SQLAlchemy()
# jwt = JWTManager()

# def create_app(config_name=None):
#     """Application factory function."""
#     app = Flask(__name__)
    
#     # Load configuration
#     if config_name is None:
#         config_name = os.environ.get('FLASK_ENV', 'default')
    
#     from config import config
#     app.config.from_object(config[config_name])
    
#     # Initialize extensions with app
#     db.init_app(app)
#     jwt.init_app(app)
#     CORS(app)
    
#     # Register blueprints
#     from routes import auth_bp, donors_bp, receivers_bp
#     app.register_blueprint(auth_bp, url_prefix='/api/auth')
#     app.register_blueprint(donors_bp, url_prefix='/api/donors')
#     app.register_blueprint(receivers_bp, url_prefix='/api/receivers')
    
#     # Create database tables
#     with app.app_context():
#         db.create_all()
    
#     @app.route('/api/health')
#     def health_check():
#         return {'status': 'healthy'}
    
#     return app

# if __name__ == '__main__':
#     app = create_app()
#     app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))


from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes import auth_bp,donors_bp,receivers_bp  # Import auth blueprint
# from routes import donors_bp
import os
from extensions import mongo, bcrypt  # Import extensions
jwt = JWTManager()

def create_app(config_name=None):
    """Application factory function."""
    app = Flask(__name__)
    @app.route('/')
    def index():
        return "Welcome to the Donor Plus API!"

    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    from config import config
    app.config.from_object(config[config_name])

    # MongoDB configuration
    app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb+srv://syedarija02:5hMe1v623zHetK1Q@donor-app.jet0b3m.mongodb.net/donor-plus?retryWrites=true&w=majority")
    
    # Initialize extensions with app
    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    
# Register the blueprint with the Flask app
    app.register_blueprint(donors_bp, url_prefix='/api/donors')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(receivers_bp, url_prefix='/api/receivers')
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True,port=int(os.environ.get('PORT', 5000)))

# ----------------------------------------------------------
# from flask import Flask, request, jsonify
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from flask_pymongo import PyMongo
# import os
# from datetime import timedelta

# # Initialize extensions
# mongo = PyMongo()
# jwt = JWTManager()
# bcrypt = Bcrypt()

# def create_app(config_name=None):
#     """Application factory function."""
#     app = Flask(__name__)
    
#     # Load configuration
#     if config_name is None:
#         config_name = os.environ.get('FLASK_ENV', 'default')
    
#     from config import config
#     app.config.from_object(config[config_name])

#     # MongoDB configuration
#     app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb+srv://your_mongo_uri_here")
    
#     # Initialize extensions with app
#     mongo.init_app(app)
#     jwt.init_app(app)
#     bcrypt.init_app(app)
#     CORS(app)

#     # Register blueprints
#     from routes import auth_bp, donors_bp, receivers_bp
#     app.register_blueprint(auth_bp, url_prefix='/api/auth')
#     app.register_blueprint(donors_bp, url_prefix='/api/donors')
#     app.register_blueprint(receivers_bp, url_prefix='/api/receivers')
    
#     @app.route('/api/health')
#     def health_check():
#         return {'status': 'healthy'}
    
#     return app

# # User Registration Route
# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     data = request.get_json()

#     if not data or 'email' not in data or 'password' not in data:
#         return jsonify({"message": "Missing email or password"}), 400
    
#     email = data['email']
#     password = data['password']

#     # Check if the user already exists in either the 'donors' or 'receivers' collection
#     existing_user = mongo.db.donors.find_one({"email": email}) or mongo.db.receivers.find_one({"email": email})

#     if existing_user:
#         return jsonify({"message": "User already exists"}), 409

#     # Hash the password using bcrypt
#     hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

#     # Store the new user in MongoDB (store hashed password)
#     new_user = {
#         'email': email,
#         'password': hashed_password,
#     }

#     # Save user in donors or receivers collection based on the business logic (for example, donors)
#     mongo.db.donors.insert_one(new_user)

#     return jsonify({"message": "User registered successfully"}), 201

# # User Login Route
# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     data = request.get_json()

#     if not data or 'email' not in data or 'password' not in data:
#         return jsonify({"message": "Missing email or password"}), 400
    
#     email = data['email']
#     password = data['password']

#     # Check if the user exists in either the 'donors' or 'receivers' collection
#     user = mongo.db.donors.find_one({"email": email}) or mongo.db.receivers.find_one({"email": email})

#     if not user:
#         return jsonify({"message": "User not found"}), 404

#     # Check if the password matches using bcrypt
#     if not bcrypt.check_password_hash(user['password'], password):
#         return jsonify({"message": "Invalid credentials"}), 401

#     # Create JWT token
#     token = create_access_token(
#         identity=str(user['_id']),
#         expires_delta=timedelta(hours=1)  # Token expiration (1 hour)
#     )

#     return jsonify({
#         'message': 'Login successful',
#         'token': token
#     }), 200

# if __name__ == '__main__':
#     app = create_app()
#     app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))