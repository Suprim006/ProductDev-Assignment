# app.py
import os
import requests
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = "https://api.gemini.com/v1/models/gemini-1.5-flash-latest:generateContent"  # Replace with the actual Gemini API chat endpoint
HEADERS = {"Authorization": f"Bearer {GEMINI_API_KEY}", "Content-Type": "application/json"}

@app.route("/")
def index():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    response = requests.post(
        API_URL,
        headers=HEADERS,
        json={"message": user_message}
    )

    if response.status_code == 200:
        ai_response = response.json().get("response", "Sorry, I didn’t understand that.")
    else:
        ai_response = "Sorry, there was an issue with the AI model."

    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(debug=True)
