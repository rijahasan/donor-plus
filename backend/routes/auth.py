from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import mongo, bcrypt  # Import extensions
from datetime import timedelta
import re

auth_bp = Blueprint('auth', __name__)

# Helper function to validate email format
def validate_email(email):
    """Validate email format."""
    email_regex = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
    return re.match(email_regex, email) is not None

# Helper function to validate password (minimum 8 characters, 1 letter, 1 number)
def validate_password(password):
    """Validate password strength."""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Za-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    return True

# User Registration Route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate registration data
    if not data or 'email' not in data or 'password' not in data or 'user_type' not in data:
        return jsonify({"message": "Missing email, password, or user_type"}), 400

    email = data['email']
    password = data['password']
    user_type = data['user_type']

    # Validate email format
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password strength
    if not validate_password(password):
        return jsonify({'error': 'Password must be at least 8 characters long, contain a letter and a number'}), 400

    # Check if the user already exists in either the 'donors' or 'receivers' collection
    existing_user = mongo.db.donors.find_one({"email": email}) or mongo.db.receivers.find_one({"email": email})

    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    # Hash the password using bcrypt
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create user object to insert into database
    user_data = {
        'email': email,
        'password': hashed_password,
        'first_name': data.get('first_name'),
        'last_name': data.get('last_name'),
        'phone': data.get('phone'),
        'location': data.get('location'),  # Add location for both donors and receivers
    }

    if user_type == 'donor':
        user_data['blood_type'] = data.get('blood_type')  # Only add blood type for donors
        
        # Save user in donors collection
        mongo.db.donors.insert_one(user_data)
        collection_name = 'donors'
    elif user_type == 'receiver':
        # Save user in receivers collection, but no blood type field
        del user_data['blood_type']  # Remove blood type for receivers
        
        mongo.db.receivers.insert_one(user_data)
        collection_name = 'receivers'
    else:
        return jsonify({"message": "Invalid user type, must be 'donor' or 'receiver'"}), 400

    return jsonify({
        "message": f"User registered successfully in {collection_name} collection",
        'user': user_data
    }), 201

# User Login Route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate login data
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing email or password"}), 400

    email = data['email']
    password = data['password']

    # Try to find user in donors or receivers collection
    user = mongo.db.donors.find_one({"email": email}) or mongo.db.receivers.find_one({"email": email})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the password matches using bcrypt
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Create JWT token
    access_token = create_access_token(
        identity=str(user['_id']),
        expires_delta=timedelta(hours=1)
    )

    return jsonify({
        'message': 'Login successful',
        'token': access_token
    }), 200
