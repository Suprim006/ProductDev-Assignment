import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 
        'postgresql://username:password@localhost:5432/chatbot_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
