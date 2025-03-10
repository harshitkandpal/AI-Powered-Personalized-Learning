import requests
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot', __name__)

API_KEY = "AIzaSyB9ZhPtJL7gX77j9oi0_ZkejdszjBAMC0U"  # Replace with your actual API key
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

@chatbot_bp.route('/chatbot', methods=['POST', 'GET'])
def chatbot():
    if request.method == 'POST':
        # Get user input and student data from POST request
        user_input = request.json.get('message')
        learning_speed_score = request.json.get('learning_speed_score')
        progress = request.json.get('progress')

        # Create a personalized prompt considering the student's learning data
        chatbot_prompt = f"Student's learning speed score is {learning_speed_score} and their progress is {progress}. Respond to the following: {user_input}"

        # Call the Gemini API for response
        gemini_response = call_gemini_api(chatbot_prompt)

        return jsonify({'response': gemini_response}), 200
    else:
        return jsonify({'message': 'Hello! How can I assist you today?'}), 200

# Function to call Gemini API
def call_gemini_api(prompt):
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    # Make POST request to Gemini API
    response = requests.post(GEMINI_API_URL, headers=headers, json=payload)

    # Check response status and parse the generated content
    if response.status_code == 200:
        try:
            # Parse the JSON response
            data = response.json()

            # Extract the relevant text from the candidates array
            generated_text = data['candidates'][0]['content']['parts'][0]['text']

            return generated_text  # Return only the relevant text

        except (KeyError, IndexError, json.JSONDecodeError) as e:
            return f"Error in parsing Gemini API response: {e}"
    else:
        return f"Error in response from Gemini API: Status code {response.status_code}"
