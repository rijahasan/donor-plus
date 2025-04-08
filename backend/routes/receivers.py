from flask import Blueprint, request, jsonify
# from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo, bcrypt  # Import extensions
# from models import User, Donation, Message
from datetime import datetime

receivers_bp = Blueprint('receivers', __name__)

@receivers_bp.route('/all', methods=['POST'])
def get_all_receivers():
    """Fetch all donors from the donors collection in the 'donor-plus' database."""
    
    # Ensure we're connecting to the correct database and collection
    receivers_collection = mongo.db['receivers']  # Access 'donors' collection
    
    # Fetch all documents from the 'donors' collection
    receivers = receivers_collection.find()

    # Convert the cursor to a list of donors
    receivers_list = [receiver for receiver in receivers]

    # Return the donors as a JSON response
    return jsonify({'receivers': receivers_list}), 200
# def create_request():
#     """Create a new blood request."""
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if not user or user.user_type != 'receiver':
#         return jsonify({'error': 'Unauthorized'}), 403
    
#     data = request.get_json()
    
#     try:
#         # Create a new donation request
#         donation = Donation(
#             receiver_id=user.id,
#             donor_id=None,  # Will be filled when a donor accepts
#             location=data.get('location', 'Not specified'),
#             status='pending',
#             notes=data.get('notes', '')
#         )
        
#         # Update receiver's urgency level if provided
#         if 'urgency_level' in data:
#             user.urgency_level = data['urgency_level']
        
#         db.session.add(donation)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Blood request created successfully',
#             'request': donation.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# @receivers_bp.route('/requests', methods=['GET'])
# @jwt_required()
# def get_receiver_requests():
#     """Get blood requests for a receiver."""
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if not user or user.user_type != 'receiver':
#         return jsonify({'error': 'Unauthorized'}), 403
    
#     requests = Donation.query.filter_by(receiver_id=user.id).order_by(Donation.date.desc()).all()
    
#     return jsonify({
#         'requests': [request.to_dict() for request in requests]
#     }), 200

# @receivers_bp.route('/contact/<int:donor_id>', methods=['POST'])
# @jwt_required()
# def contact_donor(donor_id):
#     """Contact a donor."""
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if not user or user.user_type != 'receiver':
#         return jsonify({'error': 'Unauthorized'}), 403
    
#     # Check if donor exists
#     donor = User.query.get(donor_id)
    
#     if not donor or donor.user_type != 'donor':
#         return jsonify({'error': 'Donor not found'}), 404
    
#     data = request.get_json()
    
#     try:
#         # Create a message to the donor
#         message = Message(
#             sender_id=user.id,
#             receiver_id=donor_id,
#             content=data.get('message', 'I need blood donation. Can you help?')
#         )
        
#         # Create a donation request
#         donation = Donation(
#             receiver_id=user.id,
#             donor_id=None,  # Will be filled if donor accepts
#             location=data.get('location', 'Not specified'),
#             status='pending',
#             notes=data.get('notes', '')
#         )
        
#         db.session.add(message)
#         db.session.add(donation)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Contact request sent successfully',
#             'request': donation.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500

# @receivers_bp.route('/urgency', methods=['PUT'])
# @jwt_required()
# def update_urgency():
#     """Update receiver urgency level."""
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
    
#     if not user or user.user_type != 'receiver':
#         return jsonify({'error': 'Unauthorized'}), 403
    
#     data = request.get_json()
    
#     try:
#         user.urgency_level = data.get('urgency_level', 'normal')
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Urgency level updated successfully',
#             'urgency_level': user.urgency_level
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500