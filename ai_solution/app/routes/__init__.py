from flask_restx import Api
from app.routes.chat import chat_bp
from app.routes.auth import auth_bp

def register_blueprints(app):
    app.register_blueprint(chat_bp)
    app.register_blueprint(auth_bp)


    api = Api(app, title='My API', description='API Documentation with Swagger UI')
    api.add_namespace(auth_bp, path='/auth')
    api.add_namespace(chat_bp, path='/chat')
