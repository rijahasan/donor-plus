from datetime import datetime
import re

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