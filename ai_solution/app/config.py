import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 
        'postgresql://postgres:suprim00@localhost:5432/pd_assignment_ai_solution')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_HEADERS = 'Content-Type'
    CORS_SUPPORTS_CREDENTIALS = True
