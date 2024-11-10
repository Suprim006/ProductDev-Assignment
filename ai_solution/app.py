# app.py
import os
import requests
from flask import Flask, request, jsonify, render_template, abort
import google.generativeai as genai
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
CORS(app)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/")
def index():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    if not user_message:
        abort(400, description="No message provided")  # Handle empty message

    chat = model.start_chat()
    response = chat.send_message(user_message)
    ai_response = response.text

    print(ai_response)

    if ai_response is None:
        ai_response = "Sorry, there was an issue with the AI model."

    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(debug=True)
