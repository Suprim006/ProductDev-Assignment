from flask_restx import Api, Namespace
from app.routes.chat import chat_bp
from app.routes.auth import auth_bp
from app.routes.contacts_inquiry import contact_bp
from app.routes.solutions import solution_bp
from app.routes.customer_feedback import feedback_bp
from app.routes.promotional_events import event_bp
from app.routes.articles import article_bp
from app.routes.dashboard import dashboard_bp

auth_namespace = Namespace('auth', description='Authentication operations')
chat_namespace = Namespace('chat', description='Chat operations')

def register_blueprints(app):
    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(contact_bp, url_prefix='/api')
    app.register_blueprint(solution_bp, url_prefix='/api')
    app.register_blueprint(feedback_bp, url_prefix='/api')
    app.register_blueprint(event_bp, url_prefix='/api')
    app.register_blueprint(article_bp, url_prefix='/api')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    
    # api = Api(app, title='My API', description='API Documentation with Swagger UI')
    # api.add_namespace(auth_namespace, path='/auth')
    # api.add_namespace(chat_namespace, path='/chat')
