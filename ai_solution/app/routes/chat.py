# app/routes/chat.py
from flask import Blueprint, request, jsonify, abort, render_template
from app.services.ai_service import get_ai_response

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/")
def index():
    return render_template("chat.html")

@chat_bp.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        abort(400, description="No message provided")

    ai_response = get_ai_response(user_message)
    return jsonify({"response": ai_response})
