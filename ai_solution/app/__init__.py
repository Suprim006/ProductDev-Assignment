# app/__init__.py

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

load_dotenv()

login_manager = LoginManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Single CORS configuration
    CORS(app, 
         origins="http://localhost:3000",
         allow_credentials=True,
         supports_credentials=True,
         resources={
             r"/api/*": {
                 "origins": "http://localhost:3000",
                 "allow_headers": ["Content-Type", "Authorization"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
             }
         })
    
    # Remove the after_request handler since CORS middleware handles everything

    db.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'

    migrate.init_app(app, db)
    init_db(db)
    register_blueprints(app)

    return app