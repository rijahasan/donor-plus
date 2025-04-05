from datetime import datetime
import re
import os
import requests

def format_date(date_str):
    """Format date string to datetime object."""
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        return None

def is_valid_email(email):
    """Check if email is valid."""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def is_valid_phone(phone):
    """Check if phone number is valid."""
    pattern = r'^\+?[0-9]{10,15}$'
    return re.match(pattern, phone) is not None

def sanitize_input(text):
    """Sanitize input text."""
    if not text:
        return ''
    
    # Remove HTML tags
    clean_text = re.sub(r'<[^>]*>', '', text)
    
    # Remove special characters
    clean_text = re.sub(r'[^\w\s\.,;:!?()-]', '', clean_text)
    
    return clean_text
def get_distance_between(origin, destination):
    lat1, lng1 = origin
    lat2, lng2 = destination
    api_key = os.getenv('GOOGLE_API_KEY')

    url = (
        f"https://maps.googleapis.com/maps/api/distancematrix/json?"
        f"origins={lat1},{lng1}&destinations={lat2},{lng2}&key={api_key}"
    )

    try:
        response = requests.get(url)
        result = response.json()
        distance_meters = result['rows'][0]['elements'][0]['distance']['value']
        return distance_meters / 1000  # Convert to kilometers
    except Exception as e:
        print("Google API error:", e)
        return float('inf')