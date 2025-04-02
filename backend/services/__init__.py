# Import services to make them available from the services package
from .auth_service import validate_registration, validate_login
from .donor_service import can_donate, get_compatible_donors, calculate_distance