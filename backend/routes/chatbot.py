

import requests
import json
from flask import Blueprint, request, jsonify
from firebase_admin import firestore

chatbot_bp = Blueprint('chatbot', __name__)

# Gemini API configuration
API_KEY = "AIzaSyB9ZhPtJL7gX77j9oi0_ZkejdszjBAMC0U"  # Move this to environment variables in production
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

@chatbot_bp.route('/chatbot', methods=['POST', 'GET'])
def chatbot():
    if request.method == 'POST':
        try:
            # Get the Firestore database instance
            db = firestore.client()
            
            # Get user input and user ID from request
            data = request.get_json()
            user_input = data.get('message', '')
            user_id = data.get('user_id')  # Get student ID if available
            
            # Default values
            learning_speed_score = 50
            progress = 50
            course_context = "general learning"
            
            # If user_id is provided, fetch student data from Firestore
            if user_id:
                try:
                    student_ref = db.collection('students').document(user_id)
                    student_doc = student_ref.get()
                    
                    if student_doc.exists:
                        student_data = student_doc.to_dict()
                        learning_speed_score = student_data.get('learning_speed_score', 50)
                        
                        # Get current course if available
                        current_course_id = student_data.get('current_course_id')
                        if current_course_id:
                            course_ref = db.collection('courses').document(current_course_id)
                            course_doc = course_ref.get()
                            if course_doc.exists:
                                course_data = course_doc.to_dict()
                                course_context = course_data.get('title', 'general learning')
                                
                        # Get progress data if available
                        progress_ref = db.collection('progress').where('student_id', '==', user_id).limit(1)
                        progress_docs = progress_ref.stream()
                        for doc in progress_docs:
                            progress_data = doc.to_dict()
                            progress = progress_data.get('percentage', 50)
                
                except Exception as e:
                    print(f"Error fetching student data: {e}")
                    # Continue with default values if there's an error
            
            # Create personalized prompt considering student data
            chatbot_prompt = f"""
            As a personalized learning assistant for an educational platform:
            - The student's learning speed score is {learning_speed_score}/100
            - Their current progress is {progress}%
            - They're currently studying: {course_context}
            
            Respond to their question in a helpful, encouraging manner:
            "{user_input}"
            
            Keep your response concise and tailored to their learning pace.
            """
            
            # Call the Gemini API for response
            gemini_response = call_gemini_api(chatbot_prompt)
            
            # Store conversation in Firebase if user_id is provided
            if user_id:
                try:
                    chat_ref = db.collection('chat_history').document()
                    chat_ref.set({
                        'user_id': user_id,
                        'user_message': user_input,
                        'bot_response': gemini_response,
                        'timestamp': firestore.SERVER_TIMESTAMP
                    })
                except Exception as e:
                    print(f"Error storing chat history: {e}")
            
            return jsonify({'response': gemini_response}), 200
            
        except Exception as e:
            return jsonify({'response': f"Error processing request: {str(e)}"}), 500
    else:
        return jsonify({'message': 'Hello! How can I assist you with your learning today?'}), 200

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
    
    try:
        # Make POST request to Gemini API
        response = requests.post(GEMINI_API_URL, headers=headers, json=payload)
        
        # Check response status and parse the generated content
        if response.status_code == 200:
            try:
                # Parse the JSON response
                data = response.json()
                
                # Extract the relevant text from the candidates array
                generated_text = data['candidates'][0]['content']['parts'][0]['text']
                
                return generated_text
                
            except (KeyError, IndexError, json.JSONDecodeError) as e:
                return f"Error in parsing Gemini API response: {str(e)}"
        else:
            return f"Error from Gemini API: Status code {response.status_code}"
    except requests.exceptions.RequestException as e:
        return f"Network error connecting to Gemini API: {str(e)}"

