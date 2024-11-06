# # services.py
# import os
# import requests
# from dotenv import load_dotenv

# load_dotenv()
# HUGGING_FACE_API_KEY = os.getenv("HUGGING_FACE_API_KEY")
# API_URL = "https://api-inference.huggingface.co/models/your_model_name"
# HEADERS = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}

# def get_ai_response(message):
#     response = requests.post(
#         API_URL,
#         headers=HEADERS,
#         json={"inputs": message}
#     )
#     if response.status_code == 200:
#         return response.json().get("generated_text", "Sorry, I didn’t understand that.")
#     return "Sorry, there was an issue with the AI model."
