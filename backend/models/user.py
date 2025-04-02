from app import db
from passlib.hash import pbkdf2_sha256
from datetime import datetime

class User(db.Model):
    """User model for storing user related details."""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    blood_type = db.Column(db.String(5), nullable=False)
    user_type = db.Column(db.String(10), nullable=False)  # 'donor' or 'receiver'
    is_available = db.Column(db.Boolean, default=False)
    last_donation = db.Column(db.DateTime, nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    has_donated_before = db.Column(db.Boolean, default=False)
    urgency_level = db.Column(db.String(10), nullable=True)  # 'urgent', 'high', 'normal'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    donations_given = db.relationship('Donation', backref='donor', 
                                     foreign_keys='Donation.donor_id', lazy=True)
    donations_received = db.relationship('Donation', backref='receiver', 
                                        foreign_keys='Donation.receiver_id', lazy=True)
    messages_sent = db.relationship('Message', backref='sender', 
                                   foreign_keys='Message.sender_id', lazy=True)
    messages_received = db.relationship('Message', backref='receiver', 
                                       foreign_keys='Message.receiver_id', lazy=True)
    
    def __init__(self, **kwargs):
        """Initialize a new User."""
        super(User, self).__init__(**kwargs)
        if 'password' in kwargs:
            self.set_password(kwargs['password'])
    
    def set_password(self, password):
        """Set password hash."""
        self.password_hash = pbkdf2_sha256.hash(password)
    
    def check_password(self, password):
        """Check password against hash."""
        return pbkdf2_sha256.verify(password, self.password_hash)
    
    def to_dict(self):
        """Convert user object to dictionary."""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'blood_type': self.blood_type,
            'user_type': self.user_type,
            'is_available': self.is_available,
            'last_donation': self.last_donation.isoformat() if self.last_donation else None,
            'has_donated_before': self.has_donated_before,
            'urgency_level': self.urgency_level,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }