from models import User
from datetime import datetime, timedelta

def can_donate(user):
    """Check if a donor can donate blood."""
    if not user or user.user_type != 'donor':
        return False
    
    # Check if user is available
    if not user.is_available:
        return False
    
    # Check if user has donated recently (within 56 days)
    if user.last_donation:
        last_donation = user.last_donation
        next_eligible = last_donation + timedelta(days=56)
        if datetime.utcnow() < next_eligible:
            return False
    
    return True

def get_compatible_donors(blood_type):
    """Get compatible blood types for a receiver."""
    compatibility = {
        'A+': ['A+', 'A-', 'O+', 'O-'],
        'A-': ['A-', 'O-'],
        'B+': ['B+', 'B-', 'O+', 'O-'],
        'B-': ['B-', 'O-'],
        'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        'AB-': ['A-', 'B-', 'AB-', 'O-'],
        'O+': ['O+', 'O-'],
        'O-': ['O-']
    }
    
    return compatibility.get(blood_type, [])

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in kilometers."""
    from math import radians, cos, sin, asin, sqrt
    
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers
    
    return c * r