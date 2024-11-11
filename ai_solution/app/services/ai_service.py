# app/services/ai_service.py
import google.generativeai as genai
from app.config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def get_ai_response(user_message):
    """Handles chat with the AI model and returns the response."""
    chat = model.start_chat()
    response = chat.send_message(user_message)
    ai_response = response.text or "Sorry, there was an issue with the AI model."
    return ai_response
