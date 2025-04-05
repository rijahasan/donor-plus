from flask import Blueprint, request, jsonify
from backend.models.user import User
from backend.utils.helpers import get_distance_between
from app import db

search_bp = Blueprint('search', __name__)

@search_bp.route('/api/search-donors', methods=['POST'])
def search_donors():
    data = request.get_json()
    receiver_lat = data.get('latitude')
    receiver_lng = data.get('longitude')
    blood_type = data.get('blood_type')
    radius_km = data.get('radius', 10)  # default to 10 km

    if not receiver_lat or not receiver_lng or not blood_type:
        return jsonify({"error": "Missing required parameters"}), 400

    # Query matching, available donors
    donors = User.query.filter_by(
        blood_type=blood_type,
        user_type='donor',
        is_available=True
    ).all()

    # Filter by distance
    nearby_donors = []
    for donor in donors:
        if donor.latitude is None or donor.longitude is None:
            continue
        dist = get_distance_between((receiver_lat, receiver_lng), (donor.latitude, donor.longitude))
        if dist <= radius_km:
            donor_info = donor.to_dict()
            donor_info['distance_km'] = round(dist, 2)
            nearby_donors.append(donor_info)

    return jsonify(nearby_donors), 200
