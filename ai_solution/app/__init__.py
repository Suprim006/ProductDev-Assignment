import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from app.config import Config
from app.routes import register_blueprints
from app.models.models import db, init_db, User

# Load environment variables
load_dotenv()

login_manager = LoginManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # Convert user_id to integer as it's passed as a string
        return User.query.get(int(user_id))
    
    login_manager.login_view = 'auth.login'  # Replace with your login route
    login_manager.login_message = 'Please log in to access this page.'

    migrate.init_app(app, db)

    init_db(db)

    # Register blueprints for routes
    register_blueprints(app)

    return app