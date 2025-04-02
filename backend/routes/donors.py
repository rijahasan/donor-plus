from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import User, Donation, Message
from datetime import datetime
from sqlalchemy import func

donors_bp = Blueprint('donors', __name__)

@donors_bp.route('/', methods=['GET'])
def get_donors():
    """Get all available donors."""
    # Get query parameters
    blood_type = request.args.get('blood_type')
    radius = request.args.get('radius', 50, type=int)
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    
    # Base query
    query = User.query.filter_by(user_type='donor', is_available=True)
    
    # Filter by blood type if provided
    if blood_type:
        query = query.filter_by(blood_type=blood_type)
    
    # Filter by location if provided
    # In a real app, you would use a geospatial query here
    # For simplicity, we'll just return all donors
    
    donors = query.all()
    
    return jsonify({
        'donors': [donor.to_dict() for donor in donors]
    }), 200

@donors_bp.route('/nearby', methods=['GET'])
@jwt_required()
def get_nearby_donors():
    """Get nearby donors for a receiver."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.user_type != 'receiver':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get query parameters
    radius = request.args.get('radius', 50, type=int)
    
    # In a real app, you would use a geospatial query here
    # For simplicity, we'll just return all available donors with matching blood type
    donors = User.query.filter_by(
        user_type='donor', 
        is_available=True,
        blood_type=user.blood_type
    ).all()
    
    return jsonify({
        'donors': [donor.to_dict() for donor in donors]
    }), 200

@donors_bp.route('/donations', methods=['GET'])
@jwt_required()
def get_donor_donations():
    """Get donations for a donor."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.user_type != 'donor':
        return jsonify({'error': 'Unauthorized'}), 403
    
    donations = Donation.query.filter_by(donor_id=user.id).order_by(Donation.date.desc()).all()
    
    return jsonify({
        'donations': [donation.to_dict() for donation in donations]
    }), 200

@donors_bp.route('/availability', methods=['PUT'])
@jwt_required()
def update_availability():
    """Update donor availability."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.user_type != 'donor':
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    try:
        user.is_available = data.get('is_available', False)
        db.session.commit()
        
        return jsonify({
            'message': 'Availability updated successfully',
            'is_available': user.is_available
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donors_bp.route('/respond/<int:request_id>', methods=['POST'])
@jwt_required()
def respond_to_request(request_id):
    """Respond to a blood request."""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.user_type != 'donor':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Find the donation request
    donation = Donation.query.get(request_id)
    
    if not donation:
        return jsonify({'error': 'Request not found'}), 404
    
    data = request.get_json()
    
    try:
        # Update the donation with donor information
        donation.donor_id = user.id
        donation.status = 'accepted'
        donation.notes = data.get('notes', '')
        
        # Update donor's last donation date
        user.last_donation = datetime.utcnow()
        user.has_donated_before = True
        
        # Create a message to the receiver
        message = Message(
            sender_id=user.id,
            receiver_id=donation.receiver_id,
            content=f"I've accepted your blood donation request. {data.get('message', '')}"
        )
        
        db.session.add(message)
        db.session.commit()
        
        return jsonify({
            'message': 'Request accepted successfully',
            'donation': donation.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500