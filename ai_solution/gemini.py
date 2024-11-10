import os
import google.generativeai as genai

genai.configure(api_key='AIzaSyBd8eC5bMxmU5N_DKM1mFMLO9XzZmpfgF4')

model = genai.GenerativeModel("gemini-1.5-flash")

# response = model.generate_content("Write a story about a magic backpack.", stream=True)
# for chunk in response:
#     print(chunk.text)
#     print("_" * 80)

    
chat = model.start_chat(
    history=[
        {"role": "user", "parts": "Hello"},
        {"role": "model", "parts": "Great to meet you. What would you like to know?"},
    ]
)
response = chat.send_message("I have 2 dogs in my house.")
print(response.text)
response = chat.send_message("How many paws are in my house?")
print(response.text)

# chat = model.start_chat(
#     history=[
#         {"role": "user", "parts": "Hello"},
#         {"role": "model", "parts": "Great to meet you. What would you like to know?"},
#     ]
# )
# response = chat.send_message("I have 2 dogs in my house.", stream=True)
# for chunk in response:
#     print(chunk.text)
#     print("_" * 80)
# response = chat.send_message("How many paws are in my house?", stream=True)
# for chunk in response:
#     print(chunk.text)
#     print("_" * 80)

# print(chat.history)

# response = model.generate_content(
#     "Tell me a story about a magic backpack.",
#     generation_config=genai.types.GenerationConfig(
#         # Only one candidate for now.
#         candidate_count=1,
#         stop_sequences=["x"],
#         max_output_tokens=20,
#         temperature=1.0,
#     ),
# )

# print(response.text)