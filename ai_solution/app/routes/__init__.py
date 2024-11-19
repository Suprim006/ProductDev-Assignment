from flask_restx import Api, Namespace
from app.routes.chat import chat_bp
from app.routes.auth import auth_bp

auth_namespace = Namespace('auth', description='Authentication operations')
chat_namespace = Namespace('chat', description='Chat operations')

def register_blueprints(app):
    app.register_blueprint(chat_bp)
    app.register_blueprint(auth_bp)

    api = Api(app, title='My API', description='API Documentation with Swagger UI')
    api.add_namespace(auth_namespace, path='/auth')
    api.add_namespace(chat_namespace, path='/chat')
