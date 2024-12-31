from flask import Blueprint, request, jsonify, abort, render_template
from flask_login import current_user, login_required
from app.services.ai_service import ChatbotService
from app.models.models import db, ChatMessage

chat_bp = Blueprint("chat", __name__)
chatbot_service = None

def init_chatbot():
    """Initialize chatbot service"""
    global chatbot_service
    if chatbot_service is None:
        chatbot_service = ChatbotService()

@chat_bp.before_app_first_request
def before_first_request():
    """Initialize chatbot before first request"""
    init_chatbot()

@chat_bp.route("/")
def index():
    return render_template("index.html")

@chat_bp.route("/chat", methods=["POST"])
async def chat():
    try:
        user_message = request.json.get("message")
        if not user_message:
            abort(400, description="No message provided")
        
        # Ensure chatbot is initialized
        if chatbot_service is None:
            init_chatbot()
        
        # Create chat message record
        chat_message = ChatMessage(
            user_id=current_user.id if current_user.is_authenticated else 1,
            content=user_message
        )
        db.session.add(chat_message)
        
        # Get AI response
        ai_response = await chatbot_service.get_ai_response(user_message)
        
        # Update chat message with response
        chat_message.response = ai_response
        db.session.commit()
        
        return jsonify({
            "response": ai_response,
            "messageId": chat_message.id
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error in chat route: {str(e)}")
        return jsonify({
            "error": "An error occurred processing your request",
            "response": "I apologize, but I'm having trouble processing your request right now. Please try again later."
        }), 500