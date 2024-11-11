# app/routes/__init__.py
from app.routes.chat import chat_bp

def register_blueprints(app):
    app.register_blueprint(chat_bp)
