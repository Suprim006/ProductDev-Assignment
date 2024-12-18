from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint

# Initialize db here instead of importing it from app
db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(256), unique=True, nullable=False)  # Increased length
    email = db.Column(db.String(256), unique=True, nullable=False)     # Increased length
    password_hash = db.Column(db.String(256))                          # Increased length
    role = db.Column(db.String(20), nullable=False, default='customer')  # admin, user, customer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship with chat messages
    messages = db.relationship('ChatMessage', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_regular_user(self):
        return self.role == 'user'

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ContactInquiry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20))
    company_name = db.Column(db.String(100))
    country = db.Column(db.String(50))
    job_title = db.Column(db.String(50))
    job_details = db.Column(db.Text, nullable=True)
    company_location = db.Column(db.String(50), nullable=True)
    interested_product = db.Column(db.String(50), nullable=True)
    current_solution = db.Column(db.Text, nullable=True)
    inquiry_reason = db.Column(db.Text, nullable = True)
    submission_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='Pending')

    @staticmethod
    def get_by_status(status):
        """Retrieve all inquiries with the specified status."""
        return ContactInquiry.query.filter_by(status=status).all()


class Solution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    industry = db.Column(db.String(50))
    key_features = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    customer = db.relationship('User', backref='solutions', lazy=True)

    @staticmethod
    def get_by_industry(industry):
        return Solution.query.filter_by(industry=industry).all()


class CustomerFeedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    feedback_text = db.Column(db.Text)
    rating = db.Column(db.Integer, 
                       CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
                       nullable=True)  # Set nullable to True if you want to allow no rating
    feedback_date = db.Column(db.DateTime, default=datetime.utcnow)

    customer = db.relationship('User', backref='feedbacks', lazy=True)

    @staticmethod
    def get_average_rating(customer_id):
        ratings = CustomerFeedback.query.filter_by(customer_id=customer_id).all()
        return sum(feedback.rating for feedback in ratings) / len(ratings) if ratings else 0


class PromotionalEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(100), nullable=False)
    event_description = db.Column(db.Text)
    event_start_date = db.Column(db.DateTime)
    event_end_date = db.Column(db.DateTime)
    location = db.Column(db.String(100))
    image_url = db.Column(db.String(255))
    is_upcoming = db.Column(db.Boolean, default=True)
    
    @staticmethod
    def get_events(is_upcoming):
        return PromotionalEvent.query.filter_by(is_upcoming=is_upcoming).all()
    
    @staticmethod
    def update_is_upcoming():
        """Update events to mark them as not upcoming if the current date has passed the event start date."""
        current_date = datetime.utcnow()
        events_to_update = PromotionalEvent.query.filter(
            PromotionalEvent.event_start_date < current_date,
            PromotionalEvent.is_upcoming == True
        ).all()

        for event in events_to_update:
            event.is_upcoming = False
        
        db.session.commit()


class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    published_date = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    
    author = db.relationship('User', backref='articles', lazy=True)

    @staticmethod
    def get_events(category):
        return Article.query.filter_by(category=category).all()


def init_db(database):
    global db
    db = database 