# app/__init__.py
import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.config import Config
from app.routes import register_blueprints

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Register blueprints for routes
    register_blueprints(app)

    return app
