def validate_registration(data):
    """Validate registration data."""
    required_fields = ['first_name', 'last_name', 'email', 'password', 'phone', 'blood_type', 'user_type']
    
    # Check if all required fields are present
    for field in required_fields:
        if field not in data:
            return {
                'valid': False,
                'message': f'Missing required field: {field}'
            }
    
    # Validate email format
    if '@' not in data['email']:
        return {
            'valid': False,
            'message': 'Invalid email format'
        }
    
    # Validate password length
    if len(data['password']) < 6:
        return {
            'valid': False,
            'message': 'Password must be at least 6 characters long'
        }
    
    # Validate user type
    if data['user_type'] not in ['donor', 'receiver']:
        return {
            'valid': False,
            'message': 'User type must be either donor or receiver'
        }
    
    # Validate blood type
    valid_blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    if data['blood_type'] not in valid_blood_types:
        return {
            'valid': False,
            'message': 'Invalid blood type'
        }
    
    # If receiver, validate urgency level if provided
    if data['user_type'] == 'receiver' and 'urgency_level' in data:
        valid_urgency_levels = ['urgent', 'high', 'normal']
        if data['urgency_level'] not in valid_urgency_levels:
            return {
                'valid': False,
                'message': 'Invalid urgency level'
            }
    
    return {
        'valid': True,
        'message': 'Validation successful'
    }

def validate_login(data):
    """Validate login data."""
    required_fields = ['email', 'password']
    
    # Check if all required fields are present
    for field in required_fields:
        if field not in data:
            return {
                'valid': False,
                'message': f'Missing required field: {field}'
            }
    
    # Validate email format
    if '@' not in data['email']:
        return {
            'valid': False,
            'message': 'Invalid email format'
        }
    
    return {
        'valid': True,
        'message': 'Validation successful'
    }