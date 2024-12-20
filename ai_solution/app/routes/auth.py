from flask import Blueprint, request, jsonify, current_app
from flask_login import login_user, logout_user, login_required, current_user
from app.models.models import User, db
from functools import wraps
from datetime import datetime, timedelta
import jwt

auth_bp = Blueprint('auth', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin():
            return jsonify({'error': 'Admin privileges required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'customer')  # Default role
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Registration successful'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        login_user(user)
        
        # Create session token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        response = jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role
            },
            'token': token
        })
        
        # Set secure cookie
        response.set_cookie(
            'session',
            value=token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            path='/',
            max_age=86400  # 24 hours
        )
        
        return response
    
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    response = jsonify({'message': 'Logged out successfully'})
    response.delete_cookie('session')
    return response

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'created_at': user.created_at.isoformat()
        } for user in users]
    })

@auth_bp.route('/users/<int:user_id>/role', methods=['PUT'])
def update_user_role(user_id):
    data = request.get_json()
    user = User.query.get_or_404(user_id)
    
    if data['role'] not in ['admin', 'user', 'customer']:
        return jsonify({'error': 'Invalid role'}), 400
    
    user.role = data['role']
    db.session.commit()
    
    return jsonify({'message': 'Role updated successfully'})

@auth_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Validate required fields
    if not all(key in data for key in ['username', 'email', 'password', 'role']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if username or email already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data['role'],
        created_at=datetime.utcnow()
    )
    new_user.set_password(data['password'])

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'role': new_user.role,
                'created_at': new_user.created_at.isoformat()
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Check for username/email conflicts
    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
    
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
    
    try:
        # Update fields
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'role' in data:
            user.role = data['role']
        if 'password' in data and data['password']:  # Only update password if provided
            user.set_password(data['password'])
        
        db.session.commit()
        return jsonify({
            'message': 'User updated successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'created_at': user.created_at.isoformat()
            }
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500